class CreateTasks < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.string :todo
      t.date :deadline

      t.timestamps
    end
  end

  def self.down
    drop_table :tasks
  end
end
