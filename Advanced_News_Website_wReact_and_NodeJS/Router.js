import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import NavbarMenu from '../NavbarMenu/NavbarMenu'
import CardView from '../CardView/CardView'
import ArticleDetail from '../ArticleDetail/ArticleDetail'
import Favorites from '../Favorites/Favorites'
import SearchResults from '../SearchResults/SearchResults'

const Router = () => (
  <BrowserRouter>
    <NavbarMenu/>
    <Switch>
      <Route path="/" exact  render={()=> <CardView name={"home"} />} />
      <Route path="/world" exact render={() => <CardView name={"world"} />} />
      <Route path="/politics" exact render={() => <CardView name={"politics"} />} />
      <Route path="/business" exact render={() => <CardView name={"business"} />} />
      <Route path="/technology" exact render={() => <CardView name={"technology"} />} />
      <Route path="/sport" exact render={() => <CardView name={"sport"} />} />
      <Route path="/favorites" exact render={() => <Favorites name={"favorites"} />} />
      <Route path="/detail/:id+" exact render={(props) => <ArticleDetail {...props} />} />
      <Route path="/search/:query+" exact render={(props) => <SearchResults {...props} />} />
    </Switch>
  </BrowserRouter>
);

export default Router;