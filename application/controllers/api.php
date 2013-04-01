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

	/**
	 * @todo clean GET input
	 */
	public function user_get()
	{
		if ($this->get('id'))
		{
			// grab a single user
			$result = $this->guide->get('user_profiles', array('user_id' => $this->get('id')), true);
		}
		else
		{
			// grab all users
			$result = $this->guide->get('user_profiles');
		}

		$this->response($result);
	}

	/**
	 * @todo clean GET input
	 */
	public function user_post()
	{
		// only allow if a user is trying to edit their own profile
		if ($this->tank_auth->get_user_id() == $this->post('user_id'))
		{
			$data = array(
				'fname' => $this->post('fname'),
				'lname' => $this->post('lname'),
				'major' => $this->post('major')
			);

			$affected_rows = $this->guide->update('user_profiles', array('user_id' => $this->post('user_id')), $data);
			$result = $this->guide->get('user_profiles', array('user_id' => $this->post('user_id')), true);

			// return the data so the resource in AngularJS maintains its state
			$this->response($result, 200);
		}
		else
		{
			$this->response(array('status' => false, 'error' => 'Not authorized'), 401);
		}

	}

	public function upload_post()
	{
		$config['upload_path'] = './uploads/';
		$config['allowed_types'] = 'gif|jpg|png';

		$this->load->library('upload', $config);

		if (!$this->upload->do_upload('file'))
		{
			$this->response(array('error' => strip_tags($this->upload->display_errors())), 400);
		}
		else
		{
			$upload = $this->upload->data();
			$this->response($upload, 200);
		}
	}
}