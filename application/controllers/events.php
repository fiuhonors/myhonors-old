<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Events extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library(array('form_validation', 'eventslibrary'));
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
}

/* End of file events.php */
/* Location: ./application/controllers/events.php */