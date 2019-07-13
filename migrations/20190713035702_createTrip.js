
exports.up = function(knex, Promise) {
    if (! (await knex.schema.hasTable('trip')) ) {
        await knex.schema.createTable('trip', function (table) {
          table.increments('tripId').primary();
          table.string('name');
          table.float('price');                
          table.string('description');          
          table.string('location');                    
          table.string('image');      
        });  
};

exports.down = function(knex, Promise) {
      knex.schema.dropTable('trip');
};
}