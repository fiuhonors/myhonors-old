<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Attendance extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library(array('form_validation', 'attendancelibrary'));
	}

	/**
	 * This function is necessary for all controllers that act as "resources".
	 * It allows us to pass parameters directly into the index function so our
	 * API can ask for resource/id instead of resource/index/id
	 * @param  mixed $method the first parameter in the URL
	 */
	public function _remap($method)
	{
		if (method_exists($this, $method))
		{
			$this->$method();
		}
		else
		{
			$this->index($method);
		}
	}

	public function index($userid = null)
	{
		if (isset($userid))
		{
			// grab attendance of a single user
			$attendance = $this->attendancelibrary->get($userid);
		}
		else
		{
			// grab attendance of all users
			$attendance = $this->attendancelibrary->get();
		}

		$this->output->set_content_type('application/json')->set_output(json_encode($attendance));
	}
}

/* End of file attendance.php */
/* Location: ./application/controllers/attendance.php */