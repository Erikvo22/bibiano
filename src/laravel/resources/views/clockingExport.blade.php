<table>
    <thead>
    <tr>
        <th>Fecha</th>
        <th>Nombre del usuario</th>
        <th>Hora de entrada</th>
        <th>Hora de salida</th>
        <th>Total de horas</th>
    </tr>
    </thead>
    <tbody>

        @foreach($data as $user => $date) 
            @foreach ($date as $d => $day) 
                @foreach ($day['hour'] as $raw) 
                    <tr>
                        <td>{{ $d }}</td>
                        <td>{{ $user }}</td>
                        <td>{{ $raw['E'] ?? '' }}</td>
                        <td>{{ $raw['S'] ?? '' }}</td>
                        <td>{{ $raw['TOTAL'] ?? '' }}</td>
                    </tr>
                @endforeach
            @endforeach
        @endforeach
    
    </tbody>
</table>