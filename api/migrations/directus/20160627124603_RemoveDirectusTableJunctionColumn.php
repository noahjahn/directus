<?php
use Ruckusing\Migration\Base as Ruckusing_Migration_Base;

class RemoveDirectusTableJunctionColumn extends Ruckusing_Migration_Base
{
    public function up()
    {
        $this->remove_column('directus_tables', 'is_junction_table');
    }//up()

    public function down()
    {
        $this->add_column('directus_tables', 'is_junction_table', 'tinyinteger', [
            'limit' => 1,
            'null' => false,
            'default' => 0
        ]);
    }//down()
}
