<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Events extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library(array('form_validation', 'eventslibrary'));
	}

	public function index($eventid = null)
	{
		if (isset($eventid))
		{
			// grab a single event
			$events = $this->eventslibrary->getEvents($eventid);
		}
		else
		{
			// grab all events
			$events = $this->eventslibrary->getEvents();
		}

		$this->output->set_content_type('application/json')->set_output(json_encode($events));
	}

	public function attendance()
	{
		$this->form_validation->set_rules('userid', 'Panther ID', 'required');

		if ($this->form_validation->run() == false)
		{
			$this->load->view('events/attendance');
		}
		else
		{
			$userid = $this->input->post('userid');
			$attendance = $this->eventslibrary->getAttendance($userid);
			$this->output->set_content_type('application/json')->set_output(json_encode($attendance));
		}
	}
}

/* End of file events.php */
/* Location: ./application/controllers/events.php */