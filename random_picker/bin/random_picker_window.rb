# -*- coding: utf-8 -*-
$LOAD_PATH.unshift(File.dirname(__FILE__))

require 'Qt'
require 'char_control'
require 'text_paint_widget'

class RandomPickerWindow < Qt::MainWindow
  slots 'clear()',
        'start()',
        'stop()',
        'slider_value_changed(int)',
        'about()',
        'aboutQt()'

  def initialize(parent = nil)
    super

    @char_control = CharControl.new()

    setWindowTitle("〜次の文字は、何かな〜")
    setMinimumSize(160, 160)

    createActions()
    createMenus()
    setupWidget()
    setLayout()
  end

  def sizeHint
    return Qt::Size.new(800,600)
  end

  def setupWidget
    @start_button = Qt::PushButton.new("start")
    @stop_button = Qt::PushButton.new("stop")
    connect(@start_button, SIGNAL('clicked()'), self, SLOT('start()'))
    connect(@stop_button, SIGNAL('clicked()'), self, SLOT('stop()'))

    @main_charactor_view = TextPaintWidget.new()

    default_column_count = 5

    @list_charactor_slider = Qt::Slider.new(Qt::Horizontal)
    @list_charactor_slider.setMinimum(3)
    @list_charactor_slider.setMaximum(10)
    @list_charactor_slider.setSliderPosition(default_column_count)
    @list_charactor_slider.setTickInterval(1)
    @list_charactor_slider.setTickPosition(2)
    connect(@list_charactor_slider, SIGNAL('valueChanged(int)'), self, SLOT('slider_value_changed(int)'))

    # 継承した方がすっきりするか？
    @list_charactor_view = Qt::TableWidget.new()
    update_list_char(default_column_count)
  end

  def update_list_char(column_count)
    @list_charactor_view.clearContents
    selected_char = @char_control.selected_char_list
    row_count = [1, (selected_char.size - 1)/column_count + 1].max

    cell_size = 50
    @list_charactor_view.setColumnCount(column_count)
    column_count.times do |i|
      @list_charactor_view.setColumnWidth(i, cell_size)
    end

    @list_charactor_view.setRowCount(row_count)
    row_count.times do |i|
      @list_charactor_view.setRowHeight(i, cell_size)
    end

    selected_char_idx = 0
    font = Qt::Font.new()
    font.setPixelSize( cell_size - 6 )
    row_count.times do |row_idx|
      column_count.times do |column_idx|
        char = selected_char[selected_char_idx]
        break if char.nil?
        item = Qt::TableWidgetItem.new
        item.setText(char)
        item.setTextAlignment(Qt::AlignCenter)
        item.setFont(font)
        @list_charactor_view.setItem(row_idx, column_idx, item)
        selected_char_idx += 1
      end
    end
  end

  def setLayout()
    left_button_layout = Qt::HBoxLayout.new do |n|
      n.addWidget(@start_button)
      n.addWidget(@stop_button)
    end

    left_widget = Qt::Widget.new()
    left_widget.layout = Qt::VBoxLayout.new do |m|
      m.addWidget(@main_charactor_view)
      m.addStretch()
      m.addLayout(left_button_layout)
    end

    right_widget = Qt::TableWidget.new()
    right_widget.layout = Qt::VBoxLayout.new do |m|
      m.addWidget(@list_charactor_view)
      m.addWidget(@list_charactor_slider)
    end

    splitter = Qt::Splitter.new(Qt::Horizontal)
    splitter.addWidget(left_widget)
    splitter.addWidget(right_widget)
    setCentralWidget(splitter)
  end

  def createActions()
    @clearAct = Qt::Action.new(tr("&Clear..."), self)
    @clearAct.statusTip = tr("Clear charactor list")
    connect(@clearAct, SIGNAL('triggered()'), self, SLOT('clear()'))

    @aboutAct = Qt::Action.new(tr("&About"), self)
    @aboutAct.statusTip = tr("Show the application's About box")
    connect(@aboutAct, SIGNAL('triggered()'), self, SLOT('about()'))

    @aboutQtAct = Qt::Action.new(tr("About &Qt"), self)
    @aboutQtAct.statusTip = tr("Show the Qt library's About box")
    connect(@aboutQtAct, SIGNAL('triggered()'), $qApp, SLOT('aboutQt()'))
  end

  def createMenus()
    @fileMenu = menuBar().addMenu(tr("&File"))
    @fileMenu.addAction(@clearAct)

    @helpMenu = menuBar().addMenu(tr("&Help"))
    @helpMenu.addAction(@aboutAct)
    @helpMenu.addAction(@aboutQtAct)
  end

  def clear()
    # 設定ファイルを消す
  end

  def start()
    #ルーレットが回るだけ（ビューがかわるだけで実際は何もおこらない）
    @main_charactor_view.start_selection
  end

  def stop()
    # 新しい文字を取り出し、ビューを更新する
    @main_charactor_view.showing_char = @char_control.get_next_char
    column_count = @list_charactor_slider.value
    update_list_char(column_count)
  end

  def slider_value_changed(slider_value)
    update_list_char(slider_value)
  end

  def about()
    Qt::MessageBox.about(self, tr("About Menu"),
                   ("結婚式余興〜文字ランダム出現システム〜Version1.0"))
  end

end
