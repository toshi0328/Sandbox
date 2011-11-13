$LOAD_PATH.unshift(File.dirname(__FILE__))

require 'Qt'
require 'random_picker_window'

app = Qt::Application.new(ARGV)
window = RandomPickerWindow.new
window.show
app.exec


