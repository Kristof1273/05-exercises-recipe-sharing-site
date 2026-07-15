<?php
declare(strict_types=1);

$host = 'db';
$db   = 'recipe_db';
$user = 'admin';
$pass = 'secretpassword';

$dsn = "pgsql:host=$host;port=5432;dbname=$db;";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (\PDOException $e) {
    die(json_encode(["error" => "Database connection failed."]));
}
?>