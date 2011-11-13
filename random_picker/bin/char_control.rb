# -*- coding: utf-8 -*-
class CharControl
  attr_reader :char_list
  attr_reader :selected_list

  def initialize()
    @char_list = ['あ','い','う','え','お','か','き','く','け','こ']
    @selected_list = []
  end

  def get_next_char
    return nil if(unselected_list.size == 0)
    return @char_list[get_next]
  end

  def get_next
    return -1 if unselected_list.size == 0
    if unselected_list.size == 1
      next_no = unselected_list[0]
    else
      rand_index = rand(unselected_list.size)
      next_no = unselected_list[rand_index]
    end
    @selected_list.push(next_no)
    return next_no
  end

  def selected_char_list
    return_char_list = Array.new(@selected_list.size)
    @selected_list.each_with_index do | selected_index, i |
      return_char_list[i] = @char_list[selected_index]
    end
    return return_char_list
  end

  def unselected_list
    return_list = []
    @char_list.size.times do |index|
      return_list.push(index) if !@selected_list.include?(index)
    end
    return return_list
  end

  def save_to_file
  end

  def loat_from_file
  end
end
