class HerosController < ApplicationController
  def show
    @hero = Hero.find(params[:id])
  end

  def index
    @user = current_user #User.find(session[:user_id])
    @hero = @user.heros.all
  end
end
