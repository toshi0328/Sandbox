# -*- coding: utf-8 -*-
require 'Qt'

class TextPaintWidget < Qt::Widget

  def initialize()
    super
    @showing_char = ''
  end

  def start_selection
    # TODO アニメーションを起動する
p "start animation"
    
  end

  def showing_char=(new_char)
    # TODO アニメーションを起動する
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
