<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>Nomor Ticket Keluhan: {{ $data['ticket_keluhan'] }}</h3>
    <h6>Nomor Ticket Maintenance: {{ $data['ticket_maintenance'] }}</h6>
    <p style="white-space:pre-line">{{ $data['message'] }}</p>
    <p>Terimakasih</p>
</body>
</html>
