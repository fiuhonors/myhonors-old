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

	public function get($eventid = null)
	{
		if (isset($eventid))
		{
			$result = $this->ci->guide->get('events', array('eid' => $eventid), true);
		}
		else
		{
			$result = $this->ci->guide->get('events');
		}

		return $result;
	}
}

/* End of file Eventslibrary.php */
/* Location: ./application/libraries/Eventslibrary.php */
