# -*- coding: utf-8 -*-
class CharControl
  attr_reader :char_list
  attr_accessor :selected_list
  attr_reader :star_get_position

  @@file_name = "selected_list_idx"
  def initialize()
    @char_list = [
      '☆',
      'あ','い','う','え','お',
      'か','き','く','け','こ',
      'さ','し','す','せ','そ',
      'た','ち','つ','て','と',
      'な','に','ぬ','ね','の',
      'は','ひ','ふ','へ','ほ',
      'ま','み','む','め','も',
      'や','ゆ','よ',
      'ら','り','る','れ','ろ',
      'わ','を','ん',
      'が','ぎ','ぐ','げ','ご',
      'ざ','じ','ず','ぜ','ぞ',
      'だ','ぢ','づ','で','ど',
      'ば','び','ぶ','べ','ぼ',
      'ぱ','ぴ','ぷ','ぺ','ぽ']

    @selected_list = []
    @star_get_position = 5
    load_from_file
  end

  def self.get_selected_list_file_name_fullpath
    return File.dirname(__FILE__) + "/" + @@file_name
  end

  def get_random_char
    return @char_list[rand(@char_list.size - 1)]
  end

  def get_next_char
    return nil if(unselected_list.size == 0)
    return @char_list[get_next]
  end

  def get_next
    return -1 if unselected_list.size == 0
    if unselected_list.size == 1
      next_no = unselected_list[0]
    elsif selected_list.size == @star_get_position and selected_list.index(0).nil?
      next_no = 0
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
    file_name = CharControl.get_selected_list_file_name_fullpath
    File.open(file_name, 'w') do |f|
      @selected_list.each do | ele |
        f.puts ele
      end
    end
  end

  def load_from_file
    file_name = CharControl.get_selected_list_file_name_fullpath
    if(File.exists?(file_name))
      File.open(file_name, 'r') do |f|
        while l = f.gets
          index = l.to_i
          @selected_list.push(index)
        end
      end
    end
  end

  def clear_file
    File.delete(CharControl.get_selected_list_file_name_fullpath)
    initialize()
  end
end
