<?php
declare(strict_types=1);

session_start();
require 'db.php';


$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($path, '/api/') === 0) {
    header('Content-Type: application/json');
    
    if ($path === '/api/register' && $method === 'POST') {
        $username   = $_POST['username'] ?? '';
        $first_name = $_POST['first_name'] ?? '';
        $last_name  = $_POST['last_name'] ?? '';
        $email      = $_POST['email'] ?? '';
        $password   = $_POST['password'] ?? '';

        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$username, $first_name, $last_name, $email, $password_hash]);
            
            echo json_encode(["message" => "Registration successful!"]);
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "Username or email already in use!"]);
        }
        exit;
    }
    
    elseif ($path === '/api/login' && $method === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                
                echo json_encode(["message" => "You are logged in!"]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Incorrect username or password!"]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error during login."]);
        }
        exit;
    }

    elseif ($path === '/api/logout' && $method === 'POST') {
        session_destroy();
        echo json_encode(["message" => "Logged out"]);
        exit;
    }
    elseif ($path === '/api/check-auth' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["error" => "You are not logged in!"]);
        } else {
            echo json_encode(["message" => "Everything works!"]);
        }
        exit;
    }
    elseif ($path === '/api/recipes' && $method === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["error" => "You are not logged in!"]);
            exit;
        }

        $title = $_POST['title'] ?? '';
        $ingredients = $_POST['ingredients'] ?? '';
        $instructions = $_POST['instructions'] ?? '';
        $user_id = $_SESSION['user_id'];

        if (empty($title) || empty($ingredients) || empty($instructions)) {
            http_response_code(400);
            echo json_encode(["error" => "You have to fill everything!"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO recipes (user_id, title, ingredients, instructions) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $title, $ingredients, $instructions]);
            echo json_encode(["message" => "Recipe saved!"]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error during saving: " . $e->getMessage()]);
        }
        exit;
    }
    elseif ($path === '/api/recipes' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["error" => "You are not logged in!"]);
            exit;
        }

        try {
            $stmt = $pdo->query("
                SELECT r.id, r.title, r.ingredients, r.instructions, r.created_at, u.username 
                FROM recipes r 
                JOIN users u ON r.user_id = u.id 
                ORDER BY r.created_at DESC
            ");
            $recipes = $stmt->fetchAll();   
            echo json_encode($recipes);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error during loading."]);
        }
        exit;
    }
}

http_response_code(404);
echo "404 Not Found";
?>