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
		$this->load->library('form_validation');
		$this->load->model('guide');
	}

	/**
	 * @todo clean GET input
	 */
	public function events_get()
	{
		if ($this->get('id'))
		{
			// grab a single event
			$result = $this->guide->get('events', array('event_id' => $this->get('id')), true);
		}
		else
		{
			// grab all events
			$result = $this->guide->get('events');
		}

		$this->response($result);
	}

	/**
	 * @todo clean GET input
	 */
	public function attendance_get()
	{
		if ($this->get('id'))
		{
			$query = $this->guide->get('attendance', array('user_id' => $this->get('id')));

			$result = array(
				'userid' => $this->get('id'),
				'events' => array()
			);

			foreach ($query as $attended)
			{
				$event = $this->guide->get('events', array('event_id' => $attended['event_id']), true);

				if (!empty($event))
				{
					$result['events'][$event['event_id']] = array(
						'event_id' => $event['event_id'],
						'type' => $event['type'],
						'name' => $event['name'],
						'date' => $event['begins'],
					);
				}
			}
		}
		else
		{
			$query = $this->guide->get('attendance');

			$result = array();

			foreach ($query as $attended)
			{
				// generate desired structure
				$result[$attended['user_id']][$attended['event_id']] = $attended['timestamp'];
			}
		}

		$this->response($result);
	}
}