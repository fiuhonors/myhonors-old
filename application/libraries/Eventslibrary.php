<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Provides all the common functions needed to support the events module.
 */
class Eventslibrary {

	public function __construct()
	{
		$this->ci =& get_instance();
		$this->ci->load->model(array('guide'));
	}

	/**
	 * Fetches all the events that a user has attended and the corresponding event information
	 * @param  string|int $userid the user's identification number
	 * @return array              an multidimensional array that contains the user's id, and 
	 */
	public function getAttendance($userid)
	{
		$query = $this->ci->guide->get('attendance', array('pid' => $userid));

		$result = array(
			'userid' => $userid,
			'events' => array()
		);

		foreach ($query as $attended)
		{
			$event = $this->ci->guide->get('events', array('eid' => $attended['eid']), true);

			if (!empty($event))
			{
				$result['events'][] = array(
					'type' => $event['type'],
					'name' => $event['name'],
					'date' => $event['begins'],
				);
			}
		}

		return $result;
	}
}

/* End of file Eventslibrary.php */
/* Location: ./application/libraries/Eventslibrary.php */