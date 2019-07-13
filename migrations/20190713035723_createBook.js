
exports.up = function(knex, Promise) {
    if (! (await knex.schema.hasTable('book')) ) {
        await knex.schema.createTable('book', function (table) {
          table.increments('id').primary();
          table.integer('tripId');
          table.string('email');                
          table.string('checkIn');          
          table.string('checkOut');                    
          table.integer('child');                      
          table.integer('adult');      
        });  
};

exports.down = function(knex, Promise) {
      knex.schema.dropTable('book');
};
}