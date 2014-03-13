class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])
    @map = @game.map
    @player = @game.player
    @room = @game.room
    @hero = @game.hero
  end

  def input
    @action = params[:user_input]
    @game = Game.find(params[:id])
    case @action
    when /\w*east/
      @game.move_hero_east
      @game.save
    when /\w*west/
      @game.move_hero_west
      @game.save
    when /\w*north/
      @game.move_hero_north
      @game.save
    when /\w*south/
      @game.move_hero_south
      @game.save
    end
    @map = @game.map
    @player = @game.player
    @room = @game.room
    @hero = @game.hero
    render 'show'
  end

end
