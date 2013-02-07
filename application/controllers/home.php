<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller
{
	public function __construct() {
		parent::__construct();
		$this->load->library('tank_auth');
		$this->load->model('guide');
		$this->load->helper('url');
	}

	/**
	 * Check if the user is logged in. If so, we embed the user's profile
	 * information into the page. This gives us one less HTTP request to the
	 * API from Javascript, and also allows for secure but simple
	 * authentication
	 */
	public function index()
	{
		$data = array();
		$data['profile_data'] = null;

		if ($this->tank_auth->is_logged_in())
		{
			$data['profile_data'] = $this->guide->get('user_profiles', array('user_id' => $this->tank_auth->get_user_id()), true);
			$data['load_angular'] = true;

			// we separate the header & footer so CodeIgniter views can still be inserted easily
			// but most templates are generated via AngularJS 
			$this->load->view('header', $data);
			$this->load->view('footer');
		}
		else
		{
			redirect('auth/login');
		}
	}
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */