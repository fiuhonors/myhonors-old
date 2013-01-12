<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Apply extends CI_Controller
{

public function __construct()
{
	parent::__construct();
}

private function alt_authenticate()
{
	$this->load->model('guide');
}
/**
 * Authenticates current user with CAS
 * @return mixed Returns a String if login was successful, or null if it was not
 */
private function authenticate()
{
	// load stuff
	$this->load->helper('cas');
	$this->load->library('tank_auth');
	$this->load->model('guide');

	// define variables
	$username = null;
	$submitted = false;

	// check if user is logged in and, if so, assign username
	if(!($username = cas_getUser()))
	{
		if (!$this->tank_auth->is_logged_in()) {
			redirect('/apply');
		} else {
			// $user['id']	= $this->tank_auth->get_user_id();
			// $user['name']	= $this->tank_auth->get_username();
			$username = $this->tank_auth->get_user_id();
		}
	}

	// check if application has been submitted, so students can't edit their submitted data
	$application = $this->guide->get('applications', array('username' => $username), 1);

	if (empty($application)) {
			$data['username'] = $username;
			$data['submitted'] = 0;
			$this->guide->insert('applications', $data);		
	}
	if ($application['submitted'] == 2) {
		redirect('/apply/submitted');
		return 'submitted';
	}

	return $username;
}
/*
public function _remap($method)
{
	if (method_exists($this, $method))
	{
		$this->$method();
	}
	else {
		$this->index($method);
	}
}
*/

public function index($debug = null)
{
	// $this->load->model('guide');
		// check if user is logged in
		// we need to do it manually here--instead of using $this->authentication()--to prevent
		// an infinite redirect loop
		
		/* phpCAS
		 * CHALLENGE THROUGH PHPCAS
		 */
		$this->load->helper('cas');
		if($username = cas_getUser()){
			$AUTHENTICATED = TRUE;
			// /* $username = cas_getUser(); */
		}else{
			/* Tank Auth
			 * CHALLENGE THROUGH TANKAUTH
			 */
			$this->load->library('tank_auth');
			if($this->tank_auth->is_logged_in()){
				$AUTHENTICATED = TRUE;
				$username = $this->tank_auth->get_user_id();
			}else{
				$AUTHENTICATED = FALSE;
				$username = null;
			}
		}
		
		if($AUTHENTICATED){
			$this->load->view('apply/header', array('username' => $username));
			$this->load->view('apply/startpage');
			$this->load->view('apply/footer');
		}else{
			$this->load->view('apply/header', array('hideSidebar' => true, 'username' => null));
			$this->load->view('apply/splash');
			$this->load->view('apply/footer');
		}
}

public function logout()
{
	$this->load->library('tank_auth');
	$this->tank_auth->logout();
	redirect('http://myhonors.fiu.edu/deauth.php');
}

public function paper()
{ 
	$this->load->helper(array('form', 'url'));
	$this->load->library('form_validation');

	$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
	$this->form_validation->set_rules('reason', 'Reason', 'trim|required');

	if($this->form_validation->run())
	{
		// VALID FORM
		$this->load->library('email');
		$this->email->from('honors@fiu.edu', 'Honors Application');
		$this->email->to($this->input->post('email'));
		// $this->email->bcc('cgknowle@fiu.edu');
		$this->email->bcc('lopezjc@fiu.edu,cgknowle@fiu.edu');

		$this->email->subject('Your FIU Honors Paper Application');
		$this->email->message($this->load->view('email/paper_application-txt', array('reason' => $this->input->post('reason')), TRUE));

		$this->email->send();

		$this->load->view('apply/header', array('hideSidebar' => true));
		$this->load->view('apply/paper_succ', array('email' => $this->input->post('email')));
		$this->load->view('apply/footer');
	}
	else
	{
		$this->load->view('apply/header', array('hideSidebar' => true));
		$this->load->view('apply/paper_form');
		$this->load->view('apply/footer');
	}
}

public function help()
{
	$username = $this->authenticate();
	$this->load->view('apply/header', array('hideSidebar' => 'something', 'username' => $username));
	$this->load->view('apply/help');
	$this->load->view('apply/footer');
}

public function general()
{
	// check if user is logged in
	$username = $this->authenticate();

	// load stuff
	$this->load->database();
	$this->load->model('guide');
	$this->load->helper('form');
	$this->load->library('form_validation');
	
	$this->form_validation->set_rules('hidden', 'ERROR', 'required');
	$this->form_validation->set_rules('hidden2', 'ERROR', 'required');
	if($this->form_validation->run()){
		$points = array('dobdd', 'dobmm', 'dobyyyy', 'pid', 'fname', 'lname', 'major', 'med', 'vet', 'prm', 'law', 'dnt', 'phy', 'grd', 'housing', 'campus', 'year', 'semester', 'how', 'transfer', 'fiustudent', 'dualdegree', 'dualdegree_other');
		foreach($points as $point){
			if($this->input->post($point)){
				$data[$point] = $this->input->post($point);
			}else{
				$data[$point] = '';
			}
		}
		if($this->guide->get('applications', array('username' => $username))){ // Entry exists
			// Update
			foreach($data as $k => $v){
				// print_r($data);
				$this->guide->sql('UPDATE applications SET '.$k.' = '.$this->db->escape($v).' WHERE username = '.$this->db->escape($username).'');
				// $this->guide->sql('UPDATE applications SET major = '.$this->db->escape($username).' WHERE username = '.$this->db->escape($username).'');
			}
		}else{
			// Create
			$data['username'] = $username;
			$data['submitted'] = 1;
			$this->guide->insert('applications', $data);
		}
		redirect('/apply/resume');
	}else{
		// load templates
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/general_questions', $this->guide->get('applications', array('username' => $username), 1));
		$this->load->view('apply/footer');
	}
}

public function resume()
{
	// check if user is logged in
	$username = $this->authenticate();

	// load stuff
	$this->load->model('guide');

	// load templates
	$this->load->view('apply/header', array('username' => $username));
	$this->load->view('apply/extr_form', array('query' => $this->guide->get('appl_extr', array('username' => $username))));
	$this->load->view('apply/footer');
}

public function resu_edit($i = false)
{
	// check if we have an id to edit
	if (!$i)
	{
		redirect('/apply/resume');
	}
	
	// check if user is logged in
	$username = $this->authenticate();

	// load stuff
	$this->load->database();
	$this->load->model('guide');
	$this->load->library('form_validation');
	$this->form_validation->set_rules('name', 'Name', 'required');

	if ($this->form_validation->run() == FALSE) // show the form
	{
		$viewEdit = $this->guide->get('appl_extr', array('username' => $username, 'P_KEY' => $i), 1);
		$viewEdit['id'] = $i;
		
		// load templates
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/extr_edit', $viewEdit);
		$this->load->view('apply/footer');
	}
	else // form has been submitted
	{
		$points = array('name','fyear','fmonth','eyear','emonth','spec','pocname','pocnum','pocemail','hours','learn',);
		foreach ($points as $point)
		{
			$this->guide->sql('UPDATE appl_extr SET '.$point.' = '.$this->db->escape($this->input->post($point)).' WHERE username = '.$this->db->escape($username).' AND P_KEY = \''.$i.'\'');
		}
		redirect('apply/resume');
	}
}

public function resu_remove($i = 0)
{
	// check if user is logged in
	$username = $this->authenticate();

	// check if were given an id to remove
	if($i == 0)
	{
		redirect('/apply/resume');
	}

	// load stuff
	$this->load->model('guide');

	// do the removal
	$this->guide->sql('DELETE FROM appl_extr WHERE username = \''.$username.'\' AND P_KEY = \''.$i.'\'');
	redirect('/apply/resume');
}

public function resu_add()
{
	// check if user is logged in
	$username = $this->authenticate();

	// load stuff
	$this->load->library('form_validation');
	$this->load->model('guide');
	
	$query = $this->guide->get('appl_extr', array('username' => $username));
	if (count($query) >= (10))
	{
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/extr_exceed');
		$this->load->view('apply/footer');
	}
	else
	{	
		$P_KEY = $this->guide->insert('appl_extr', array('username' => $username));
		redirect('/apply/resu_edit/'.$P_KEY);
	}
}

public function documents()
{
	// check if user is logged in
	$username = $this->authenticate();
	$application = $this->guide->get('applications', array('username' => $username), 1);

	// load stuff
	$this->load->model('guide');
	
	// load templates
	$this->load->view('apply/header', array('username' => $username));
	$this->load->view('apply/essa_form', array('transfer' => $application['transfer'], 'documents' => $this->guide->get('appl_essa', array('username' => $username, 'removed' => 0))));
	$this->load->view('apply/footer');
}

public function docu_upload($supress = false)
{
	// check if user is logged in
	$username = $this->authenticate();
	$application = $this->guide->get('applications', array('username' => $username), 1);
	
	// load stuff
	$this->load->model('guide');
	$this->load->helper('form');
	
	// check if limit has been exceeded
	$limit = 2;
	if($application['transfer'] == 2) $limit = 6;
	if(count($this->guide->get('appl_essa', array('username' => $username, 'removed' => 0))) > ($limit - 1))
	{
		// load templates
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/essa_exceed');
		$this->load->view('apply/footer');
		// die();
	}else{
		$error = '';
		$this->load->library('form_validation');
		$this->form_validation->set_rules('prompt', 'Prompt', 'required');
		$this->form_validation->set_rules('l', 'Prompt', 'required');
		if ($this->form_validation->run())
		{
			// try upload
			$config['upload_path'] = './uploads/';
			$config['encrypt_name'] = TRUE;
			$config['allowed_types'] = 'txt|rtf|doc|docx|pdf';
			$this->load->library('upload', $config);
			if (!$this->upload->do_upload())
			{
				// upload failure
				$error = $this->upload->display_errors();
				if ($supress == 'l') $error = '';

				// load templates
				$this->load->view('apply/header', array('username' => $username));
				$this->load->view('apply/essa_upload', array('error' => $error, 'transfer' => $application['transfer']));
				$this->load->view('apply/footer');
			}
			else
			{
				// upload success
				$data = $this->upload->data();

				$push = array(
					'username' => $username,
					'path' => $data['full_path'],
					'orig' => $data['orig_name'],
					'prompt' => $this->input->post('prompt')
				);
				$P_KEY = $this->guide->insert('appl_essa', $push);
			
				redirect('apply/documents');
			}
		}
		else
		{
			$this->load->view('apply/header', array('username' => $username));
			$this->load->view('apply/essa_upload', array('transfer' => $application['transfer']));
			$this->load->view('apply/footer');
		}
	}
}

public function docu_remove($i = 0)
{
	// check if user is logged in
	$username = $this->authenticate();

	// check if we're given an id to remove
	if ($i == 0)
	{
		redirect('/apply/documents');
	}

	// load stuff
	$this->load->model('guide');

	$this->guide->sql('UPDATE appl_essa SET removed = 1 WHERE username = '.$this->db->escape($username).' AND P_KEY = '.$this->db->escape($i).'');
	redirect('/apply/documents');
}

public function recommendations()
{
	// check if user is logged in
	$username = $this->authenticate();
	
	// fetch
	$this->load->model('guide');
	$requests = $this->guide->get('appl_reco', array('username' => $username));
	$acad = $this->guide->get('applications', array('username' => $username), 1);
	$i = 0;
	foreach ($requests as $request)
	{
		$viewForm['status'][$i] = $request['flag'];
		$viewForm['email'][$i] = $request['email'];
		$i++;
	}
	$viewForm['count'] = $i;
	$viewForm['acad'] = $acad;
	// $viewForm['fname'] = $acad['fname'];
	// $viewForm['lname'] = $acad['lname'];
	
	
	$this->load->view('apply/header', array('username' => $username));
	$this->load->view('apply/reco_form', $viewForm);
	$this->load->view('apply/footer');
}

public function reco_add()
{
	// check if user is logged in
	$username = $this->authenticate();
	
	// load stuff
	$this->load->model('guide');

	// check if limit has been exceeded
	$limit = 3;
	$uploaded = $this->guide->get('appl_reco', array('username' => $username));
	$acad = $this->guide->get('applications', array('username' => $username), 1);

	if (count($uploaded) > ($limit - 1))
	{
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/reco_exceed');
		$this->load->view('apply/footer');
	}
	else {
		
		// form validation
		$this->load->library('form_validation');
		$this->form_validation->set_rules('email', 'Email', 'required|valid_email');
		$this->form_validation->set_rules('emailconf', 'Email Confirmation', 'required|matches[email]');

		if (!$this->form_validation->run())
		{
			$this->load->view('apply/header', array('username' => $username));
			$this->load->view('apply/reco_add');
			$this->load->view('apply/footer');
		}
		else
		{
			// generate key
			$this->load->helper('string');
			do{
				$key = random_string('sha1', 40);
				$query = $this->guide->get('appl_reco', array('key' => $key));
			} 
			while(!empty($query));

			// send the email
			$email = $this->input->post('email');
			$this->load->library('email');
			$this->email->from('honors@fiu.edu', 'The Honors College at FIU');
			$this->email->to($email); 
			$this->email->subject("Request for a letter of recommendation");
			$this->email->message("<p>An applicant to the Honors College at FIU, ".$acad['fname']." ".$acad['lname'].", has listed you as someone who would be interested in submitting a letter of recommendation for them.</p><br /><p>To submit your letter, please click  <a href='http://myhonors.fiu.edu/apply/reco_upload/$key/1'>here</a>.</p><br /><p>If you believe this message has reached you in error, please click <a href='http://myhonors.fiu.edu/apply/reco_error/$key'>here</a>.</p><br /><br /><p>Thank you,</p><p>--The Honors College at FIU</p>");	
			$this->email->send();
			// echo $this->email->print_debugger();
			
			// commit the data
			$data = array(
				'username' => $username,
				'email' => $email,
				'flag' => '1',
				'key' => $key
			);

			$P_KEY = $this->guide->insert('appl_reco', $data);
			
			redirect('/apply/recommendations');
		}
	}
}

public function reco_error($key = false)
{
	if (!$key)
	{
		show_404();
		die();
	}
	
	// RETREIVE STUDENT FROM KEY
	$this->load->model('guide');
	$this->load->database();
	$result = $this->guide->get('appl_reco', array('key' => $key), 1);
	$this->guide->sql('UPDATE appl_reco SET flag = 3 WHERE `key` = '.$this->db->escape($key).'');
	
	// NOTIFY ADMIN
	// Email
	$this->load->library('email');
	$this->email->from('applicant@fiu.edu', 'Honors College Applicant');
	$this->email->to('cknow003@fiu.edu'); 
	// $this->email->to('honors@fiu.edu'); 
	// $this->email->cc('cknow003@fiu.edu'); 
	$this->email->subject('Abused Letter of Recommendation');
	$this->email->message('Applicant data: '.json_encode($result));	
	$this->email->send();
	// echo $this->email->print_debugger();
	
	// APOLOGIZE
	$this->load->view('apply/header', array('username' => false));
	$this->load->view('apply/reco_sorry');
	$this->load->view('apply/footer');
}

public function reco_upload($key = false, $supress = false)
{
	if (!$key)
	{
		show_404();
		die();
	}

	$this->load->model('guide');

	$query = $this->guide->get('appl_reco', array('key' => $key, 'flag' => 1), 1);
	$acad = $this->guide->get('applications', array('username' => $query['username']), 1);

	if (empty($query))
	{
		show_404();
	}else{
		$error ='';
		
		$this->load->library('form_validation');
		$this->form_validation->set_rules('fname', 'First Name', 'required');
		$this->form_validation->set_rules('lname', 'Last Name', 'required');
		$this->form_validation->set_rules('relation', 'Your relationship to the student', 'required');
		$this->form_validation->set_rules('howlong', 'How long you have known the student', 'required');
		$this->form_validation->set_rules('word1', 'First of the two words', 'required');
		$this->form_validation->set_rules('word2', 'Second of the two words', 'required');
		$this->form_validation->set_rules('grade', 'Grade earned in your course', 'required');
		$this->form_validation->set_rules('year', 'Grade level the student was in', 'required');
		$this->form_validation->set_rules('institution', 'Institution Name', 'required');
		$this->form_validation->set_rules('st1', 'Street Address', 'required');
		$this->form_validation->set_rules('st2', 'Street Address', '');
		$this->form_validation->set_rules('state', 'State', 'required');
		$this->form_validation->set_rules('city', 'City', 'required');
		$this->form_validation->set_rules('zip', 'Zip Code', 'required');
		$this->form_validation->set_rules('tel', 'Phone Number', 'required');
		$this->form_validation->set_rules('rate_Acad', 'Your rating of Academic Achievement', 'required');
		$this->form_validation->set_rules('rate_Qual', 'Your rating of Quality of Writing', 'required');	
		$this->form_validation->set_rules('rate_Orig', 'Your rating of Originality and Creativity', 'required');
		$this->form_validation->set_rules('rate_Disc', 'Your rating of Discipline', 'required');
		$this->form_validation->set_rules('rate_Resp', 'Your rating of Responsibility and Maturity', 'required');
		$this->form_validation->set_rules('rate_Lead', 'Your rating of Leadership', 'required');
		$this->form_validation->set_rules('rate_Inde', 'Your rating of Independence', 'required');
		$this->form_validation->set_rules('rate_Init', 'Your rating of Initiative', 'required');
		$this->form_validation->set_rules('rate_Comm', 'Your rating of Community Involvement', 'required');
		$this->form_validation->set_rules('rate_Inte', 'Your rating of Integrity', 'required');

		if ($this->form_validation->run())
		{
			// FORM RESPONSE IS VALID
			// TRY UPLOAD
			$this->load->helper('form');
			$config['upload_path'] = './uploads/';
			$config['encrypt_name'] = TRUE;
			$config['allowed_types'] = 'txt|rtf|doc|docx|pdf';
			$this->load->library('upload', $config);
			if (!$this->upload->do_upload())
			{
				// UPLOAD FAILURE
				$error = $this->upload->display_errors();
				if($supress) $error = '';
				$this->load->view('apply/header', array('hideSidebar' => true));
				$this->load->view('apply/reco_upload', array('error' => $error, 'username' => $query['username'], 'key' => $key, 'acad' => $acad));
				$this->load->view('apply/footer');
			}
			else
			{
				// UPLOAD SUCCESS
				$this->load->database();
				$data = $this->upload->data();
				$points = array(
					'fname',
					'lname',
					'relation',
					'howlong',
					'word1',
					'word2',
					'year',
					'grade',
					'institution',
					'st1',
					'st2',
					'state',
					'city',
					'zip',
					'tel',
					'rate_Acad',
					'rate_Qual',
					'rate_Orig',
					'rate_Disc',
					'rate_Resp',
					'rate_Lead',
					'rate_Inde',
					'rate_Init',
					'rate_Comm',
					'rate_Inte',
					);
				foreach($points as $point){
					$this->guide->sql('UPDATE appl_reco SET '.$point.' = '.$this->db->escape($this->input->post($point)).' WHERE `key` = \''.$query['key'].'\'');
				}
				$this->guide->sql('UPDATE appl_reco SET full_path = '.$this->db->escape($data['full_path']).' WHERE `key` = \''.$query['key'].'\'');
				$this->guide->sql('UPDATE appl_reco SET orig_name = '.$this->db->escape($data['orig_name']).' WHERE `key` = \''.$query['key'].'\'');
				
				// SET KEY FLAG TO 2 (DELIVERED AND EXPIRED)
				$this->guide->sql('UPDATE appl_reco SET flag = 2 WHERE `key` = \''.$query['key'].'\'');
				// echo("Commited flag.  ");
				
				// SHOW THANK YOU
				$this->load->view('apply/header', array('hideSidebar' => true));
				$this->load->view('apply/reco_thanks');
				$this->load->view('apply/footer');
			}
		}
		else
		{
			// FORM RESPONSE IS INVALID
			$this->load->view('apply/header', array('hideSidebar' => true));
			$this->load->view('apply/reco_upload', array('error' => $error, 'username' => $query['username'], 'key' => $key, 'acad' => $acad));
			$this->load->view('apply/footer');
		}
	}
}

public function preview()
{
	// check if user is logged in
	$username = $this->authenticate();
	
	$this->load->model('guide');
	$acad = $this->guide->get('applications', array('username' => $username), 1);
	$extr = $this->guide->get('appl_extr', array('username' => $username));
	$essa = $this->guide->get('appl_essa', array('username' => $username));
	$reco = $this->guide->get('appl_reco', array('username' => $username));
	$application = array('acad' => $acad, 'extr' => $extr, 'essa' => $essa, 'reco' => $reco, 'ready' => true);
	
	$this->load->library('form_validation');
	$this->form_validation->set_rules('hidden', 'ERROR', 'required');
	if ($this->form_validation->run()){
		// Email
		$this->load->library('email');
		$this->email->from('applicant@fiu.edu', 'Honors College Applicant');
		$this->email->to('cknow003@fiu.edu'); 
		// $this->email->to('honors@fiu.edu'); 
		$this->email->cc('spant004@fiu.edu'); 
		$this->email->subject('New Application');
		$this->email->message('Applicant data: '.json_encode($application));	
		$this->email->send();
		// echo $this->email->print_debugger();
		
		// Lock
		$this->guide->sql('UPDATE applications SET submitted = 2 WHERE username = '.$this->db->escape($username).'');

		// Thank
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/submitted');
		$this->load->view('apply/footer');
	}else{
		$this->load->view('apply/header', array('username' => $username));
		$this->load->view('apply/preview', $application);
		$this->load->view('apply/footer');
	}
}

function submitted()
{		
	$this->load->view('apply/header', array('username' => 'something I guess'));
	$this->load->view('apply/submitted');
	$this->load->view('apply/footer');
}
/* End of file /application/controllers/apply.php */ 
}?> 
