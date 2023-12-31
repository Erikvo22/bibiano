<?php

namespace App\Http\Controllers;

use App\Models\Clocking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
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
                    'type' => $dates['type_id'],
                    'type_name' => $dates['type_name'],
                    'comments' => $dates['comments']
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

    public function store(Request $request)
    {
        $user = Auth::user();
        $currentDate = Carbon::now()->setTimezone('Europe/London');
        $type = $request->type_id;
        $comments = $request->comments;

        $newClock = new Clocking();
        $newClock->user_id = $user['id'];
        $newClock->date = $currentDate;
        $newClock->type_id = $type;
        $newClock->comments = $comments;
        $newClock->save();
    }
}
