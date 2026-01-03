<?php

// CONFIGURE AQUI
$para = "email@empresa.com.br";  // <-- coloque o email da empresa
$assunto = "Contato do site";

$nome = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$mensagem = $_POST['message'] ?? '';

if (!$nome || !$email || !$mensagem) {
    http_response_code(400);
    echo "Dados inválidos";
    exit;
}

$conteudo = "
Nome: $nome
Email: $email

Mensagem:
$mensagem
";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

if (mail($para, $assunto, $conteudo, $headers)) {
    echo "OK";
} else {
    http_response_code(500);
    echo "Erro ao enviar";
}
?>
