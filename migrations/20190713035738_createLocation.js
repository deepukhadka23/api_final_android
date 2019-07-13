
exports.up = function(knex, Promise) {
    if (! (await knex.schema.hasTable('location')) ) {
        await knex.schema.createTable('location', function (table) {
          table.increments('id').primary();
          table.string('locationName');                
          table.float('latitude');          
          table.float('longitude');                    
        });  
};

exports.down = function(knex, Promise) {
      knex.schema.dropTable('location');
};
}