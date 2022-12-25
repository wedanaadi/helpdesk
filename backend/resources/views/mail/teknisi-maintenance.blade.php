<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <p style="white-space:pre-line">{{ $data['message'][0] }} {{ $data['ticket_keluhan'] }}</p>
    <p style="white-space:pre-line">dengan Nomor: {{ $data['ticket_maintenance'] }}</p>
    <span><a href={{ $data['public_url'] }} target="_blank" rel="noopener noreferrer">Link Ticket</a></span>
    <p>Terimakasih</p>
</body>
</html>
