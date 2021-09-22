//Importar los modulos del router de angular
import { ModuleWithProviders } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

//Importar componentes a los cuales ls quiero hacer una pagina exclusiva

import { HomeComponent } from "./components/home/home.component";
import { BlogComponent } from "./components/blog/blog.component";
import { FormularioComponent } from "./components/formulario/formulario.component";
import { PaginaComponent } from "./components/pagina/pagina.component";
import { ErrorComponent } from "./components/error/error.component";

//Array de rutas

const appRoutes : Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'formulario', component: FormularioComponent},
    {path: 'pagina-de-pruebas', component: PaginaComponent}, //Hacemos que el parametro sea opcional generando la misma ruta pero sin el parametro
    {path: 'pagina-de-pruebas/:nombre/:apellidos', component: PaginaComponent},    
    {path: '**', component: ErrorComponent} // La ruta ** debe ir la última porque si no las otras no cargan

];

// Exportar el modulo de rutas

export const appRoutingProviders: any[] = [];   //Crea un array vacio sin tipo predefinido 
export const routing : ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);  // Carga todas las routas de appRoutes, hace que "existan" en Angular 