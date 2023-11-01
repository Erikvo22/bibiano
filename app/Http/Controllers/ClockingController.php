<?php

namespace App\Http\Controllers;

use App\Models\Clocking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\DB;

use DateTime;
use DateTimeZone;
use IntlDateFormatter;

class ClockingController extends Controller
{

    public function getClocksActualDay(): JsonResponse
    {
        $user = Auth::user();
        $currentDate = Carbon::now()->format('Y-m-d');
        $clocks = Clocking::where('user_id', $user['id'])
            ->whereDate('date', '=', $currentDate)
            ->get();

        return new JsonResponse([
            'data' => $clocks,
            'username' => $user['name']
        ]);
    }

    public function getClocksByUser(Request $request): JsonResponse
    {
        $dataRequest = $request->all();
        $user = Auth::user();
        $clocks = Clocking::where('user_id', $user['id']);

        if ($dataRequest['startDate'] && $dataRequest['endDate']) {
            $startDate =  Carbon::createFromFormat('d/m/Y', $dataRequest['startDate'])->format('Y-m-d');
            $endDate =  Carbon::createFromFormat('d/m/Y', $dataRequest['endDate'])->format('Y-m-d');
            $clocks = $clocks->whereBetween('date', [$startDate, $endDate]);
        }

        $clocks = $clocks->orderBy('date', 'DESC')
            ->get()
            ->groupBy(function ($d) {
                return Carbon::parse($d->date)->format('Y-m-d');
            });

        $result = [];
        $cont = 0;
        //Format data
        setlocale(LC_TIME, 'es_ES', 'Spanish_Spain', 'Spanish');
        foreach ($clocks as $key => $day) {
            $auxDate = DateTime::createFromFormat("Y-m-d", $key);
            $result[$cont]['day'] = IntlDateFormatter::formatObject(
                $auxDate,
                'EEEE dd/MM/YYYY',
                'es'
            );
            $result[$cont]['total'] = 0;
            foreach ($day as $dates) {
                $result[$cont]['dates'][] = array(
                    'day' => $dates['date'],
                    'type' => $dates['type']
                );
            }
            $cont++;
        }
        //Calculate hours
        $now = new DateTime('now', new DateTimeZone('GMT+1'));
        $now = $now->format('Y-m-d H:i:s');
        foreach ($result as $key => $r) {
            $total = 0;
            for ($i = 0; $i < count($r['dates']); $i += 2) {
                $input = isset($r['dates'][$i]) ? $r['dates'][$i]['day'] : null;
                $output = isset($r['dates'][$i + 1]) ? $r['dates'][$i + 1]['day'] : null;

                if ($input && $output) {
                    $auxCalc = strtotime($output) - strtotime($input);
                    $total += $auxCalc;
                } else if ($input && (substr($input, 0, 10) == substr($now, 0, 10))) {
                    $total += strtotime($now) - strtotime($input);
                }
            }
            $t = round(abs($total));
            $result[$key]['total'] = sprintf('%02d:%02d:%02d', ($t / 3600), ($t / 60 % 60), $t % 60);;
        }

        return new JsonResponse([
            'data' => $result,
            'user' => $user
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        $currentDate = Carbon::now()->setTimezone('Europe/London');
        $type = $request->type;

        $newClock = new Clocking();
        $newClock->user_id = $user['id'];
        $newClock->date = $currentDate;
        $newClock->type = $type;
        $newClock->save();

        return new JsonResponse([
            'success' => true,
            'message' => 'Fichaje realizado'
        ]);
    }

    public function downloadHistoryClocks()
    {

        // if ($dataRequest['startDate'] && $dataRequest['endDate']) {
        //     $startDate =  Carbon::createFromFormat('d/m/Y', $dataRequest['startDate'])->format('Y-m-d');
        //     $endDate =  Carbon::createFromFormat('d/m/Y', $dataRequest['endDate'])->format('Y-m-d');
        //     $clocks = $clocks->whereBetween('date', [$startDate, $endDate]);
        // }

        setlocale(LC_TIME, 'es_ES', 'Spanish_Spain', 'Spanish');
        $clocks = DB::table('clockings')
            ->join('users', 'clockings.user_id', '=', 'users.id')
            ->select('clockings.*', 'users.name as user_name')
            ->orderBy('clockings.date', 'asc')
            ->get();

        $result = [];
        $cont = 1;
        $position = 0;
        foreach ($clocks as $clock) {
            $dateExploded = explode(' ', $clock->date);
            $dateExplodedBefore = explode(' ', $clocks[$position]->date);

            if ($cont % 2 === 0) {
                $sizeHourArrayByDate = count($result[$clock->user_name][$dateExploded[0]]['hour']);
                $result[$clock->user_name][$dateExploded[0]]['hour'][$sizeHourArrayByDate - 1]['S'] = $clock->date;
                $fechaInicio = new DateTime($result[$clock->user_name][$dateExploded[0]]['hour'][$sizeHourArrayByDate - 1]['E']);
                $fechaFin = new DateTime($clock->date);
                $intervalo = $fechaFin->diff($fechaInicio);
                $result[$clock->user_name][$dateExploded[0]]['hour'][$sizeHourArrayByDate - 1]['TOTAL'] = $intervalo->h . 'h:' . $intervalo->i . 'm:' . $intervalo->s . 's';
                $cont = 0;
            } else {
                if ($dateExplodedBefore === $dateExploded && $position !== 0) {
                    $result[$clock->user_name][$dateExploded[0]]['hour'][] = ['E' => $clock->date];
                } else {
                    $result[$clock->user_name][$dateExploded[0]] = ['hour' => [['E' => $clock->date]]];
                }
            }
            $cont++;
            $position++;
        }


        $cabecera = '
            <table style="width: 100%; margin-bottom: 20px;">
                <tr style="border: none;">
                    <td style="width: 40%;border: none;">
                        <img src="path/to/logo.png" alt="Logo" style="width: 100px;">
                    </td>
                    <td style="width: 60%; text-align: right;border: none;">
                        <h3>Comercial Bibiano</h3>
                        <p>Calle Los Olivos, 2A</p>
                        <p>Polígono Industrial de Arinaga. Agüimes</p>
                        <p>Las Palmas. 35118</p>
                        <p>928 187 118 - 928 188 365</p>
                        <p>638 450 441 - 638 517 468</p>
                    </td>
                </tr>
            </table>
        ';

        $body = '
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
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

        $body .= '
            <h1>Informe de control horario</h1>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Nombre de usuario</th>
                    <th>Hora de entrada</th>
                    <th>Hora de salida</th>
                    <th>Total de horas</th>
                </tr>';

        foreach ($result as $user => $date) {
            foreach ($date as $d => $day) {
                foreach ($day['hour'] as $raw) {
                    $body .= "<tr>
                        <td>{$d}</td>
                        <td>{$user}</td>
                        <td>{$this->trasnformDateToHour($raw['E'])}</td>
                        <td>{$this->trasnformDateToHour($raw['S'])}</td>
                        <td>{$raw['TOTAL']}</td>
                      </tr>";
                }
            }
        }
        $body .= '</table>';
        $html = $cabecera . $body;

        // Crear el archivo PDF utilizando la librería Dompdf
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4');
        $dompdf->render();

        // Descargar el archivo PDF
        return $dompdf->stream('clocking_report.pdf');
    }

    public function trasnformDateToHour(String $date)
    {
        $time = strtotime($date);
        $hours = date('H', $time);
        $minutes = date('i', $time);
        $seconds = date('s', $time);

        return $hours . 'h:' . $minutes . 'm:' . $seconds . 's';
    }
}
