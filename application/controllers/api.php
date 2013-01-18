<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH.'/libraries/REST_Controller.php';

/**
 * This API controller uses philsturgeon's RESTful server implementation for CodeIgniter
 * For more details and usage information, see https://github.com/philsturgeon/codeigniter-restserver
 */
class Api extends REST_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library(array('form_validation', 'eventslibrary', 'attendancelibrary'));
	}

	public function events_get()
	{
		if ($this->get('id'))
		{
			// grab a single event
			$events = $this->eventslibrary->get($this->get('id'));
		}
		else
		{
			// grab all events
			$events = $this->eventslibrary->get();
		}

		$this->response($events);
	}

	public function attendance_get()
	{
		if ($this->get('id'))
		{
			$attendance = $this->attendancelibrary->get($this->get('id'));
		}
		else
		{
			$attendance = $this->attendancelibrary->get();
		}

		$this->response($attendance);
	}
}