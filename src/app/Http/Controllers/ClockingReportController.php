<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\DB;
use App\Helpers\base64;
use App\Exports\ClockingExport;
use Maatwebsite\Excel\Facades\Excel;
use DateTime;

class ClockingReportController extends Controller
{

    public function listHistoryClocks(Request $request) : JsonResponse
    {
        $filters = $request->all();
        $historyClocks = $this->getHistoryClocks($filters);
        return new JsonResponse([
            'success' => true,
            'data' => $historyClocks
        ]);
    }

    public function getHistoryClocks($filters = null)
    {
        setlocale(LC_TIME, 'es_ES', 'Spanish_Spain', 'Spanish');
        $clocks = DB::table('clockings')
            ->select('clockings.*', DB::raw('CONCAT(users.name, " ", users.firstname, " ", users.secondname) AS user_fullname'))
            ->join('users', 'clockings.user_id', '=', 'users.id');


        if (isset($filters['user'])) {
            $clocks = $clocks->where('clockings.user_id', $filters['user']);
        }

        if (isset($filters['startDate']) && !empty($filters['startDate'])) {

            $startDate =  Carbon::createFromFormat('d/m/Y', $filters['startDate']);
            $clocks = $clocks->whereDate('clockings.date', '>=', $startDate);
        }

        if (isset($filters['endDate']) && !empty($filters['endDate'])) {
            $endDate =  Carbon::createFromFormat('d/m/Y', $filters['endDate']);
            $clocks = $clocks->whereDate('clockings.date', '<=', $endDate);
        }

        $clocks = $clocks
            ->orderBy('clockings.date', 'asc')
            ->get();

        $result = [];
        $cont = 1;
        $position = 0;
        foreach ($clocks as $clock) {
            $dateExploded = explode(' ', $clock->date);
            $dateExplodedBefore = explode(' ', $clocks[$position]->date);
            $dateExplodedFormated = Carbon::createFromFormat('Y-m-d', $dateExploded[0])->format('d/m/Y');

            if ($cont % 2 === 0) {
                $sizeHourArrayByDate = count($result[$clock->user_fullname][$dateExplodedFormated]['hour']);
                $result[$clock->user_fullname][$dateExplodedFormated]['hour'][$sizeHourArrayByDate - 1]['S'] = $clock->date;
                $fechaInicio = new DateTime($result[$clock->user_fullname][$dateExplodedFormated]['hour'][$sizeHourArrayByDate - 1]['E']);
                $fechaFin = new DateTime($clock->date);
                $intervalo = $fechaFin->diff($fechaInicio);
                $result[$clock->user_fullname][$dateExplodedFormated]['hour'][$sizeHourArrayByDate - 1]['TOTAL'] = $intervalo->h . 'h:' . $intervalo->i . 'm:' . $intervalo->s . 's';
                $cont = 0;
            } else {
                if ($dateExplodedBefore === $dateExploded && $position !== 0) {
                    $result[$clock->user_fullname][$dateExplodedFormated]['hour'][] = ['E' => $clock->date];
                } else {
                    $result[$clock->user_fullname][$dateExplodedFormated] = ['hour' => [['E' => $clock->date]]];
                }
            }
            $cont++;
            $position++;
        }

        return $result;
    }

    public function downloadHistoryClocksPdf(Request $request)
    {
        $filters = $request->all();
        $historyClocks = $this->getHistoryClocks($filters);

        $base64Image = base64::headerLogo();

        $cabecera = '
            <table style="width: 100%; margin-bottom: 8px;">
                <tr style="border: none;">
                    <td style="width: 100%;border: none;">
                        <img src="' . $base64Image . '" style="width: 100%;">
                    </td>
                </tr>
            </table>
        ';

        $body = '
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px
                }
                th, td {
                    border: 1px solid black;
                    padding: 10px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>';

        $body .= "<h3>Historial de fichajes</h3>";

        if (isset($filters['startDate']) && isset($filters['endDate'])) {
            $body .= "<h4>Período: {$filters['startDate']} - {$filters['endDate']} </h4>";
        }


        $body .= " 
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Nombre del usuario</th>
                    <th>Hora de entrada</th>
                    <th>Hora de salida</th>
                    <th>Total de horas</th>
                </tr>";

        foreach ($historyClocks as $user => $date) {
            foreach ($date as $d => $day) {
                foreach ($day['hour'] as $raw) {
                    $total = $raw['TOTAL'] ?? '';
                    $body .= "<tr>
                        <td>{$d}</td>
                        <td>{$user}</td>
                        <td>{$this->trasnformDateToHour($raw['E'] ?? '')}</td>
                        <td>{$this->trasnformDateToHour($raw['S'] ?? '')}</td>
                        <td>{$total}</td>
                      </tr>";
                }
            }
        }
        $body .= '</table>';
        $html = $cabecera . $body;

        // Create PDF file using DOMPDF
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // Download PDF 
        $output = $dompdf->output();

        return response($output, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="informe_fichajes.pdf"');
    }

    public function downloadHistoryClocksCsv(Request $request)
    {
        $filters = $request->all();
        $historyClocks = $this->getHistoryClocks($filters);

        return Excel::download(new ClockingExport($historyClocks), 'informe_fichajes.csv');
    }

    private function trasnformDateToHour(String $date)
    {
        if (empty($date)) {
            return '';
        }
        $time = strtotime($date);
        $hours = date('H', $time);
        $minutes = date('i', $time);
        $seconds = date('s', $time);

        return $hours . 'h:' . $minutes . 'm:' . $seconds . 's';
    }
}
