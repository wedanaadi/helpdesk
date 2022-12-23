<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>Nomor Ticket Keluhan: {{ $data['ticket_keluhan'] }}</h3>
    <h6>Nomor Ticket Maintenance: {{ $data['ticket_maintenance'] }}</h6>
    <p style="white-space:pre-line">{{ $data['message'][0] }}</p>
    @if (count($data['message'])>1)
    <p>Hasil Update/Note: </p>
    <p style="white-space:pre-line"><strong>{{ $data['message'][1] }}</strong></p>
    @endif
    <p>Terimakasih</p>
</body>
</html>
