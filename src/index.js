/* 
 * 
 *      https://wideo.co/text-to-speech/
 * 
 */

var alumnos, datos;


class menu extends Phaser.Scene {
    constructor() {
        super({key: 'menu'}); // active:'true'
    }
    preload() {
        alumnos="hola"
        this.load.text('alumnos', './src/COMIPEMS.txt');       
    }
    create() {
        datos=this.cache.text.get("alumnos");
        datos = datos.split("\r\n");
        alumnos = new Array();
        for(var i=0; i<datos.length;i++){
            alumnos.push(datos[i].split("\t"))
        }
        
        this.texto = this.add.text(180, 130, 'Introduzca su folio ', { color: 'black', fontFamily: 'Arial', fontSize: '60px '});
        var respuesta = document.createElement('input');
        respuesta.setAttribute('type'  ,'text');
        respuesta.setAttribute('id','respuesta');
        respuesta.setAttribute('placeholder','FOLIO');
        respuesta.setAttribute('autofocus','true');
        this.res = this.add.dom(850, 160, respuesta);
        
        var boton = document.createElement('button');
        boton.setAttribute('type','button');
        this.element = this.add.dom(1200, 160, boton,'','Buscar');
        this.element.addListener('click');
        this.element.on('click',() => this.buscar());
        
        this.asis =document.createElement('h1');
        this.asis.style = 'width: 1000px; font-size: 50px; ';
        this.asis.innerHTML = "<table> <tr> <th>Faltas</th> <th>% de asistencia</th></tr>"+
                                "<tr> <th>#</th> <th>%</th></tr></table>";
        this.add.dom(1900, 130, this.asis);
        
        this.nombre =document.createElement('h1');
        this.nombre.style = 'width: 1000px; font-size: 30px; ';
        this.nombre.innerHTML = "Nombre";
        this.add.dom(800, 250, this.nombre);
        
        this.grupo =document.createElement('h1');
        this.grupo.style = 'width: 1000px; font-size: 30px; ';
        this.grupo.innerHTML = "Grupo";
        this.add.dom(1500, 250, this.grupo);
        
        this.examen =document.createElement('h3');
        this.examen.style = 'width: 1800px; font-size: 30px; ';
        this.examen.innerHTML = "<table> <tr> <th>Examen</th> <th>Total(128)</th><th>Hab Mat(16)</th><th>Hab Verb(16)</th><th>Biología(12)</th><th>Español(12)</th><th>Física(12)</th><th>FCyE(12)</th><th>Geografía(12)</th><th>Matemáticas(12)</th><th>Química(12)</th><th>Hist U(6)</th><th>Hist M(6)</th></tr>"+
                                "<tr> <th>D1</th> <th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th></tr>"+
                                "<tr> <th>D2</th> <th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th><th>#</th></tr></table>";
  
        this.add.dom(960, 350, this.examen);
        
        this.input.keyboard.on('keydown-ENTER',() => this.buscar());
    }
    buscar(){
        
        var r=document.getElementById('respuesta').value;
        r=r.toUpperCase();
        var j=0;
        var encontrado=false;
        for(var i=0; i<alumnos.length;i++){
            if(alumnos[i][1]===r){
                
                j=i;
                encontrado=true;
            }
        }
        var indices = [5, 6, 13, 7, 8, 15, 16, 14, 12, 9, 10, 11];
        
        if(encontrado){
            this.asis.innerHTML = "<table> <tr> <th>Faltas</th> <th>% de asistencia</th></tr>"+
                                "<tr> <th>"+(alumnos[j][3]-alumnos[j][4])+"</th> <th>"+(alumnos[j][4]/alumnos[j][3]*100).toFixed(2)+"%</th></tr></table>";
            this.nombre.innerHTML = alumnos[j][0]+"";
            this.grupo.innerHTML = "Grupo: "+alumnos[j][2];
            var s="";
            s="<table> <tr> <th>Examen</th> <th>Total(128)</th><th>Hab Mat(16)</th><th>Hab Verb(16)</th><th>Biología(12)</th><th>Español(12)</th><th>Física(12)</th><th>FCyE(12)</th><th>Geografía(12)</th><th>Matemáticas(12)</th><th>Química(12)</th><th>Hist U(6)</th><th>Hist M(6)</th></tr>";
            for(var k=0;k<2;k++){
                s=s+"<tr><th>D"+(k+1)+"</th>";
                for(var i=0;i<indices.length;i++){
                    if(k===0){
                        s=s+"<th>";
                        s=s+alumnos[j][indices[i]+k*12];
                        s=s+"</th>";
                    }else{
                        
                        if(parseInt(alumnos[j][indices[i]+k*12])>parseInt(alumnos[j][indices[i]+(k-1)*12])){
                            s=s+"<th style='background-color:#00FF00'>";
                        }else{
                            if(alumnos[j][indices[i]+k*12]===alumnos[j][indices[i]+(k-1)*12]){
                                s=s+"<th>";
                            }else{
                                s=s+"<th style='background-color:#FF0000'>";
                            }
                            
                        }
                        s=s+alumnos[j][indices[i]+k*12]+"  ("+(parseInt(alumnos[j][indices[i]+k*12])-parseInt(alumnos[j][indices[i]]))+")";
                        s=s+"</th>";
                    }
                    
                    
                }
                s=s+"</tr>";
            }
            s=s+"</table>"
            console.log(s);
            this.examen.innerHTML = "";
            this.examen.innerHTML = s;
        }else{
            this.nombre.innerHTML = "No encontrado";
            this.asis.innerHTML = "<table> <tr> <th>Faltas</th> <th>% de asistencia</th></tr>"+
                                "<tr> <th> ? </th> <th>? %</th></tr></table>";
                        
            var s="";
            s="<table> <tr> <th>Examen</th> <th>Total(128)</th><th>Hab Mat(16)</th><th>Hab Verb(16)</th><th>Biología(12)</th><th>Español(12)</th><th>Física(12)</th><th>FCyE(12)</th><th>Geografía(12)</th><th>Matemáticas(12)</th><th>Química(12)</th><th>Hist U(6)</th><th>Hist M(6)</th></tr>";
            for(var k=0;k<2;k++){
                s=s+"<tr><th>D"+(k+1)+"</th>";
                for(var i=0;i<indices.length;i++){
                    if(k===0){
                        s=s+"<th>";
                        s=s+"?";
                        s=s+"</th>";
                    }else{
                        s=s+"<th style='background-color:#FF0000'>";    
                        s=s+"?  (?)";
                        s=s+"</th>";
                    }
                    
                    
                }
                s=s+"</tr>\n";
            }
            s=s+"</table>"
            console.log(s);
            this.examen.innerHTML = "";
            this.examen.innerHTML = s;
        }
        
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: [menu],
    scale: {
        mode: Phaser.Scale.Fit
    },
    fps: {
        target: 30,
        forceSetTimeOut: true
    }
}
var game = new Phaser.Game(config);