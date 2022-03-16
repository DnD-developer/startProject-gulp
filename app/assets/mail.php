<?
require_once 'PHPMailer/PHPMailerAutoload.php';

$admin_email = array();
foreach ( $_POST["admin_email"] as $key => $value ) {
	array_push($admin_email, $value);
}

$form_subject = trim($_POST["form_subject"]);

$mail = new PHPMailer;
$mail->CharSet = 'UTF-8';

// Настройки SMTP
// $mail->isSMTP();
// $mail->SMTPAuth = true;
// $mail->SMTPDebug = 0;
 
// $mail->Host = 'ssl://smtp.gmail.com';
// $mail->Port = 465;
// $mail->Username = 'Логин';
// $mail->Password = 'Пароль';
$jsonText = $_POST['Товары'];
$myArray = json_decode($jsonText, true);
$prod = '';
$prod2 = '';

foreach ($myArray as $key => $value) {
		$cat = $value["name"];
	    $price = $value["price"];
	    $quant = $value["quantity"];
	    $spec = $value["dataSpecification"];
	    $prod .= "
			<tr> <td style='padding: 10px; border:none;'></td></tr>
			<tr>
				<td style='padding: 10px; width = 33.333%; border: #e9e9e9 1px solid;'>$cat</td>
				<td style='padding: 10px; width = 33.333%; border: #e9e9e9 1px solid;'>$quant</td>
				<td style='padding: 10px; width = 33.333%; border: #e9e9e9 1px solid;'>$price</td>
			</tr>
			";
		forEach ($spec as $item => $elem){
			$accessName = $item;
			$accessValue = $spec[$item];
			$prod2 .="
			<tr>
			<td style='padding: 10px; width = 33.333%; border: #e9e9e9 1px solid; border-top:none;'>$accessName</td>
			<td style='padding: 10px; width = 33.333%; border: #e9e9e9 1px solid; border-top:none;'>$accessValue</td>
			<td style='padding: 10px; width = 33.333%; border: #e9e9e9 1px solid; border-top:none;'></td>
			</tr>
			";
			}
		$prod .= $prod2;
		$prod2='';	

	}

$c = true;
$message = '';
foreach ( $_POST as $key => $value ) {
	if ( $value != ""  && $key != "admin_email" && $key != "form_subject" && $key != "Товары" ) {
		if (is_array($value)) {
			$val_text = '';
			foreach ($value as $val) {
				if ($val && $val != '') {
					$val_text .= ($val_text==''?'':', ').$val;
				}
			}
			$value = $val_text;
		}
		$message .= "
		" . ( ($c = !$c) ? '<tr>':'<tr>' ) . "
		<td style='padding: 10px; width: 50%;'><b>$key:</b></td>
		<td style='padding: 10px;width: 50%%;'>$value</td>
		</tr>
		";
	}
}
$message = $message = "<table style='width: 100%;'>$message </table> . <table style='width: 100%;>  $prod</table>";


// От кого
$mail->setFrom('adm@' . $_SERVER['HTTP_HOST'], 'Spark PC');
 
// Кому
foreach ( $admin_email as $key => $value ) {
	$mail->addAddress($value);
}
// $value  = '/usr/sbin/sendmail -S mail:1025';
// $mail->addAddress($value);
// Тема письма
$mail->Subject = $form_subject;
 
// Тело письма
$body = $message;
// $mail->isHTML(true);  это если прям верстка
$mail->msgHTML($body);

// Приложения
// if ($_FILES){
// 	foreach ( $_FILES['file']['tmp_name'] as $key => $value ) {
// 		$mail->addAttachment($value, $_FILES['file']['name'][$key]);
// 	}
// }
// $mail->send();
$mail->send();
?>
