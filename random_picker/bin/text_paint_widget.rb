# -*- coding: utf-8 -*-
require 'Qt'

class TextPaintWidget < Qt::Widget

  def initialize(char_controller)
    super()
    @showing_char = ''
    @char_controller = char_controller
  end

  def timerEvent(event)
    if( event.timerId == @random_char_timer_id)
      @showing_char = @char_controller.get_random_char
      update
    end
  end

  def start_selection
    sound_file_path = File.dirname(__FILE__)+"/resource/drum.wav"
    @sound_drum_roll = Array.new() if(@sound_drum_roll.nil?)
    adding_sound_drum_roll = Qt::Sound.new(sound_file_path)
    adding_sound_drum_roll.play
    @sound_drum_roll.push(adding_sound_drum_roll)
    @random_char_timer_id = startTimer(70)
  end

  def showing_char=(new_char)
    if(@sound_drum_roll != nil)
      @sound_drum_roll.each do |adding_sound_drum_roll|
          adding_sound_drum_roll.stop
      end
    end
    sound_file_path2 = File.dirname(__FILE__)+"/resource/cymbal.mp4"
    @sound_cymbal = Qt::Sound.new(sound_file_path2) if( @sound_cymbal == nil)
    @sound_cymbal.play

    killTimer(@random_char_timer_id)
    if new_char.nil?
      @showing_char = "終"
    else
      @showing_char = new_char
    end
    update()
  end

  def paintEvent(event)
    painter = Qt::Painter.new
    side = [width(), height()].min
    win_width = 15
    painter.begin(self)
    painter.renderHint = Qt::Painter::Antialiasing

    painter.setViewport((width() - side)/ 2, (height() - side)/ 2, side, side )
    painter.setWindow(-win_width/2, -win_width/2, win_width, win_width)
    painter.drawText(-win_width/2, -win_width/2, win_width, win_width, Qt::AlignCenter, @showing_char)
    painter.end()
  end

  def minSizeHint()
    return Qt::Size.new(300,300)
  end

  def sizeHint
    return Qt::Size.new(600,800)
  end
end
