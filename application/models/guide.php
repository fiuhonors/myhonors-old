<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Inspired by this blog post:
 * @link http://blog.builtbyprime.com/php/a-guide-to-generic-code-igniter-models
 */
class Guide extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	/**
	 * Gets information from the database.
	 * @param  string  $table  database table to query
	 * @param  array   $where  sets the WHERE clause of the query. all array values are escaped automatically
	 * @param  boolean $single if true, the returned data array with be a single dimension. use if you know you will only be getting one result
	 * @return array           the result of the DB query
	 */
	public function get($table, $where = array(), $single = false)
	{
		$q = $this->db->get_where($table, $where);
		$result = $q->result_array();

		return ($single && !empty($result)) ? $result[0] : $result;
	}

	/**
	 * Insert information into the database.
	 * @param  string       $table database table to insert into
	 * @param  array|object $data  an array with key/value or an object with property/value that corresponds to column/data in the DB. all values are escaped automatically
	 * @return int                 the insert ID number
	 */
	public function insert($table, $data)
	{
		$this->db->insert($table, $data);
		return $this->db->insert_id();
	}

	/**
	 * Update information in the database.
	 * @param  string       $table database table to update to
	 * @param  array        $where sets the WHERE clause of the query. all array values are escaped automatically
	 * @param  array|object $data  an array with key/value or an object with property/value that corresponds to column/data in the DB. all values are escaped automatically
	 * @return int                 the number of affected rows
	 */
	public function update($table, $where = array(), $data)
	{
		$this->db->update($table, $data, $where);
		return $this->db->affected_rows();
	}

	/**
	 * Deletes information from the database.
	 * @param  string $table database table to delete from
	 * @param  array  $where sets the WHERE clause of the query. all array values are escaped automatically
	 * @return int           the number of affected rows
	 */
	public function delete($table, $where = array())
	{
		$this->db->delete($table, $where);
		return $this->db->affected_rows();
	}

	/**
	 * Used for explicit database queries. No values are automatically escaped, so this is not recommended for general use.
	 * @param  string $query the query string
	 * @return mixed         if the result of the query is an object, a result array is returned. otherwise, the raw query result (likely a boolean-compatible value) is returned
	 */
	public function explicit($query)
	{
		$q = $this->db->query($query);
		return (is_object($q)) ? $q->result_array() : $q;
	}
}

/* End of file guide.php */
/* Location: ./application/models/guide.php */