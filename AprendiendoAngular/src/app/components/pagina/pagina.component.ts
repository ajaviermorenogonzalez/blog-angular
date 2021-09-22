import { Component, OnInit } from '@angular/core';
import{ Router, ActivatedRoute,Params} from '@angular/router';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.css']
})
export class PaginaComponent implements OnInit {

  /*
  característica de typescript llamada Definite Assignment Assertions en la que se usa el operador ! al final del nombre de la variable 
  para asegurarle al compilador que se le dará un valor a la variable antes de usarla.*/
  public nombre!: string;
  public apellidos!: string;

  constructor(
    private _route: ActivatedRoute, //Saca parametros por url
    private _router: Router         //Redirecciona a otras paginas
  ) { }

  ngOnInit(): void{

    this._route.params.subscribe( (params : Params) => {
      this.nombre = params.nombre;
      this.apellidos = params.apellidos;

      console.log(params);
    });

  }

  redireccion(){
    //this._router.navigate(['/formulario']); asi se redirigiria sin parametros
    this._router.navigate(['/pagina-de-pruebas', 'Werner', 'Heisenberg' ]); // Podemos redirigir indicando los parametros que queramos
  }

}
