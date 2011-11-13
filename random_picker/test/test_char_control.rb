$LOAD_PATH.unshift(File.dirname(__FILE__))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'bin'))

require 'minitest/unit'
require 'char_control'

MiniTest::Unit.autorun

class CharControlTestCase < MiniTest::Unit::TestCase
  def setup
    @char_control = CharControl.new()
  end

  def test_selected_char_list
    @char_control.selected_list.push(1)
    @char_control.selected_list.push(4)
    @char_control.selected_list.push(7)
    selected_char_list = @char_control.selected_char_list
    all_list = @char_control.char_list
    assert_equal(3, selected_char_list.size)
    assert_equal(all_list[1], selected_char_list[0])
    assert_equal(all_list[4], selected_char_list[1])
    assert_equal(all_list[7], selected_char_list[2])
  end

  def test_unselected_list
    @char_control.selected_list.push(1)
    @char_control.selected_list.push(4)
    @char_control.selected_list.push(7)
    unselected_list = @char_control.unselected_list
    all_list = @char_control.char_list
    selected_list = @char_control.selected_list

    assert_equal( selected_list.size + unselected_list.size, all_list.size)
    all_list.each_with_index do | item, index |
      assert( (unselected_list.include?(index) || selected_list.include?(index) ), "should be contains selected list or unselectedlist!")
    end
    begin
      next_no = @char_control.get_next
    end while next_no != -1
    assert_equal(0, @char_control.unselected_list.size)
  end

  def test_get_next
    selected_cnt = 0
    begin
      selected_list_before_get_next = @char_control.selected_list.clone
      next_no = @char_control.get_next # lets get NEXT!!
      assert( !@char_control.unselected_list.include?(next_no) )
      assert( !selected_list_before_get_next.include?(next_no) )
      assert( @char_control.selected_list.include?(next_no) || next_no == -1)
      selected_cnt += 1
    end while next_no != -1
    assert_equal(@char_control.char_list.size, selected_cnt - 1) # check if all number is selected?
    assert_equal(0, @char_control.unselected_list.size)
  end

  def test_get_next_char
    get_char = []
    loop do
      char = @char_control.get_next_char
      break if char.nil?
      get_char.push( char )
    end
#    p get_char
    assert_equal(get_char.sort, @char_control.char_list.sort)
  end

end
