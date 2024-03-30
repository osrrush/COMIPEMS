/* 
 * 
 */


var alumnos, datos, promedios = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], cambios=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var grafica = [100,550];                            
var indices = [5, 6, 13, 7, 8, 15, 16, 14, 12, 9, 10, 11];
var materias =["Total","Hab Mat","Hab Verb","Biología","Español","Física","FCyE","Geografía","Matemáticas","Química","Hist U","Hist M"];
var puntajes = [128,16,16,12,12,12,12,12,12,12,6,6];
var gancho=600;
const examenes = 2;
var espacio = 42;
var grupos=["A","B","C"], graphics;
var colores =[0x008888,0x880088];
var tituloG="Total";
var tamaños=[,,,,,,,,,,,,];
var alumnosPos;

class menu extends Phaser.Scene {
    constructor() {
        super({key: 'menu'}); // active:'true'
    }
    preload() {
        this.grupos=["A","B","C"];
        this.load.text('alumnos', './src/COMIPEMS.txt');       
    }
    create() {
        
        datos=this.cache.text.get("alumnos");
        datos = datos.split("\r\n");
        alumnos = new Array();
        for(var i=0; i<datos.length;i++){
            alumnos.push(datos[i].split("\t"));
        }
        
        this.texto = this.add.text(180, 50, 'Grupo ', { color: 'black', fontFamily: 'Arial', fontSize: '60px '});
        
        this.grupo =document.createElement('SELECT');
        this.grupo.setAttribute('id','grupo');
        this.grupo.setAttribute('onChange','ActualizarGrupo()');
        this.grupo.style = 'width: 200px; height:80px ;font-size: 30px; ';
        this.grupo.onChange = 'this.Actualizargrupo()';
        this.grupo.innerHTML = "<option value='*' selected>Todos</option><option value='A'>A</option><option value='B'>B</option><option value='C'>C</option>";
        //this.grupo.addListener('change');
        //this.grupo.on('change',()=>this.ActualizarGrupo());
        this.add.dom(460, 80, this.grupo);
        
        
        
        this.texto = this.add.text(600, 50, 'Alumnos ', { color: 'black', fontFamily: 'Arial', fontSize: '60px '});
        
        this.alumnos =document.createElement('SELECT');
        this.alumnos.setAttribute('id','alumnos');
        this.alumnos.setAttribute('onChange','Buscar()');
        var grupo_alumnos = "";
        for(var i=0; i<alumnos.length; i++){
            grupo_alumnos=grupo_alumnos + "<option value='"+alumnos[i][1]+"'>"+alumnos[i][0]+"</option>";
            
        }
        this.alumnos.style = 'width: 800px; height:80px ;font-size: 30px; ';
        this.alumnos.innerHTML = "<option value='*' selected>Todos</option>"+grupo_alumnos;
        this.add.dom(1260, 80, this.alumnos);
        
        
        
        this.texto = this.add.text(600, 180, 'Materias ', { color: 'black', fontFamily: 'Arial', fontSize: '60px '});
        
        this.materias =document.createElement('SELECT');
        this.materias.setAttribute('id','Materia');
        this.materias.setAttribute('onChange','Grafica()');
        var grupo_alumnos = "";
        for(var i=0; i<materias.length; i++){
            grupo_alumnos=grupo_alumnos + "<option value='"+i+"'>"+materias[i]+"</option>";
            
        }
        this.materias.style = 'width: 800px; height:80px ;font-size: 30px; ';
        this.materias.innerHTML = grupo_alumnos;
        this.add.dom(1260, 200, this.materias);
        
        
        this.nombre =document.createElement('h1');
        this.nombre.setAttribute('id','Nombre');
        this.nombre.style = 'width: 1000px; font-size: 30px; ';
        this.nombre.innerHTML = "Alumnos:Todos";
        this.add.dom(800, 250, this.nombre);
        
        this.grupo =document.createElement('h1');
        this.grupo.setAttribute('id','grupoT');
        this.grupo.style = 'width: 1000px; font-size: 30px; ';
        this.grupo.innerHTML = "Grupo: Todos";
        this.add.dom(1500, 250, this.grupo);
        
        this.examen =document.createElement('table');
        this.examen.setAttribute('id','tabla');
        this.examen.style = 'width: 1900px; font-size: 30px; ';
        var tabla_text="<tr> <th>Examen</th> <th>Total(128)</th><th>Hab Mat(16)</th><th>Hab Verb(16)</th><th>Biología(12)</th><th>Español(12)</th><th>Física(12)</th><th>FCyE(12)</th><th>Geografía(12)</th><th>Matemáticas(12)</th><th>Química(12)</th><th>Hist U(6)</th><th>Hist M(6)</th></tr>";
        
        
        //Calcular promedios
        
        var alumnosPresentados= new Array();
        for(var j=0; j<12;j++){ //materia
            for(var k=0;k<examenes;k++){ //examen
                alumnosPresentados.push(0);
                for(var i=0;i<alumnos.length;i++){ //alumno
                    if(alumnos[i][indices[0]+12*k]!==""){
                        alumnosPresentados[k] ++;
                        promedios[k][j]+=parseInt(alumnos[i][indices[j]+12*k]);
                    }
                }
                promedios[k][j]=(promedios[k][j]/alumnosPresentados[k]).toFixed(1);
                
            }
            
            
            cambios[j]=(promedios[examenes-1][j]-promedios[examenes-2][j]).toFixed(1);
            alumnosPresentados = new Array();
        }
        
        for(var k=0;k<examenes;k++){
            tabla_text = tabla_text+ "<tr><th>D"+(k+1)+"</th>";
            if(k===0){
                for(var i=0;i<promedios[k].length;i++){
                    tabla_text = tabla_text +  "<th>"+promedios[k][i]+"</th>";
                }
                tabla_text = tabla_text + "</tr>";
            }else{
                for(var i=0;i<promedios[k].length;i++){
                    if(promedios[k][i]>promedios[k-1][i]){
                        tabla_text = tabla_text +  "<th style='background-color:#00ff00'>"+promedios[k][i]+"("+(promedios[k][i]-promedios[k-1][i]).toFixed(1)+")</th>";
                    }else{
                        if(promedios[k][i]<promedios[k-1][i]){
                            tabla_text = tabla_text +  "<th style='background-color:#ff0000'>"+promedios[k][i]+"("+(promedios[k][i]-promedios[k-1][i]).toFixed(1)+")</th>";
                        }else{
                            tabla_text = tabla_text +  "<th>"+promedios[k][i]+"(0)</th>";
                        }
                    }
                }
                tabla_text = tabla_text + "</tr>";
            }
        }
        
        
        
        this.examen.innerHTML = tabla_text;
  
        this.add.dom(960, 400, this.examen);
        
        this.input.keyboard.on('keydown-ENTER',() => this.buscar());
        
        
        //gráfica
        
        var line = new Phaser.Geom.Line(100, 500, 700, 500);

        graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 } });
        
        for(var i = 0; i<12; i++){
            line = new Phaser.Geom.Line(grafica[0], grafica[1]+espacio*i, grafica[0]+gancho, grafica[1]+espacio*i);
            graphics.strokeLineShape(line);
            tamaños[i]=document.createElement('h1');
            tamaños[i].style = 'font-size: 20px; ';
            tamaños[i].innerHTML = ''+(puntajes[0]-i*puntajes[0]/11).toFixed(1);
            this.add.dom(grafica[0]-50, grafica[1]+espacio*i-20, tamaños[i]);    
        }
        line = new Phaser.Geom.Line(grafica[0], grafica[1], grafica[0], grafica[1]+espacio*11);
        graphics.strokeLineShape(line);
        line = new Phaser.Geom.Line(grafica[0]+gancho, grafica[1], grafica[0]+gancho, grafica[1]+espacio*11);
        graphics.strokeLineShape(line);
        
        this.add.text(grafica[0]+gancho/6, grafica[1]+espacio*11.5, 'Grupo A', {
                font: '20px Courier Bold',
                fill: '#000000',
            }).setOrigin(0.5);
        this.add.text(grafica[0]+gancho/2, grafica[1]+espacio*11.5, 'Grupo B', {
                font: '20px Courier Bold',
                fill: '#000000',
            }).setOrigin(0.5);
        this.add.text(grafica[0]+gancho/6*5, grafica[1]+espacio*11.5, 'Grupo C', {
                font: '20px Courier Bold',
                fill: '#000000',
            }).setOrigin(0.5);
            
        tituloG = document.createElement('h1');
        tituloG.setAttribute('id','grupoT');
        tituloG.style = 'font-size: 20px; ';
        tituloG.innerHTML = "Total";
        this.add.dom(grafica[0]+gancho/2, grafica[1]-espacio, tituloG);    
            
        
        var circle =new Phaser.Geom.Circle(500, 500, 3);
        
        for(var i=0; i<this.grupos.length;i++){ //grupo
            for(var j=0; j<alumnos.length;j++){ //alumnos
                for(var k=0; k<examenes-1;k++){ //examenes
                    if(alumnos[j][indices[0]+k*12]!=="" && alumnos[j][indices[0]+12+k*12]!==""){
                        if(parseInt(alumnos[j][indices[0]+k*12])<parseInt(alumnos[j][indices[0]+k*12+12])){
                            graphics.lineStyle(2,0x00ff00);
                        }else{
                            if(parseInt(alumnos[j][indices[0]+k*12])>parseInt(alumnos[j][indices[0]+k*12+12])){
                                graphics.lineStyle(2,0xff0000);
                            }else{
                                graphics.lineStyle(2,0x0000ff);
                            }
                        }
                        if(this.grupos[i]===alumnos[j][2]){
                            line = new Phaser.Geom.Line(grafica[0]+(1+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[0]+k*12])/128*11*espacio, grafica[0]+(2+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[0]+k*12+12])/128*11*espacio);
                            graphics.strokeLineShape(line);
                        }
                    }
                    if(alumnos[j][indices[0]+k*12]!==""){
                        if(this.grupos[i]===alumnos[j][2]){
                            circle =new Phaser.Geom.Circle(grafica[0]+(1+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[0]+k*12])/128*11*espacio, 5);
                            graphics.fillStyle(colores[k]);
                            graphics.fillCircleShape(circle);
                        }
                    }
                    if(alumnos[j][indices[0]+k*12+12]!==""){
                        if(this.grupos[i]===alumnos[j][2]){
                            circle =new Phaser.Geom.Circle(grafica[0]+(2+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[0]+k*12+12])/128*11*espacio, 5);
                            graphics.fillStyle(colores[k+1]);
                            graphics.fillCircleShape(circle);
                        }
                    }
                }
            }
        }
        
        //tabla de Posciciones
        this.pos =document.createElement('table');
        this.pos.setAttribute('id','posiciones');
        this.pos.style = 'font-size: 20px; ';
        var tabla_text="<tr><th>Posición</th><th>Nombre</th><th>Grupo</th><th>Total</th><th>% de Asistencia</th></tr>";
        
        
        alumnosPos = alumnos.sort((a,b)=>{
            if(b[indices[0]+12]===""){
                return -1;
            }else{
                if(a[indices[0]+12]===""){
                    return 1;
                }
            }
            return parseInt(b[indices[0]+12])-parseInt(a[indices[0]+12]);
            
        });
        
        for(var i=0;i<alumnosPos.length;i++){
            if(alumnosPos[i][indices[0]+12]!=="" && alumnosPos[i][indices[0]]!==""){
                if(parseInt(alumnosPos[i][indices[0]+12])>parseInt(alumnosPos[i][indices[0]])){
                    tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th style='background-color:#00ff00'>"+alumnosPos[i][indices[0]+12]+"("+(alumnosPos[i][indices[0]+12]-alumnosPos[i][indices[0]])+")</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
                }else{
                    if(parseInt(alumnosPos[i][indices[0]+12])<parseInt(alumnosPos[i][indices[0]])){
                        tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th style='background-color:#ff0000'>"+alumnosPos[i][indices[0]+12]+"("+(alumnosPos[i][indices[0]+12]-alumnosPos[i][indices[0]])+")</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
                    }else{
                        tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th>"+alumnosPos[i][indices[0]+12]+"("+(alumnosPos[i][indices[0]+12]-alumnosPos[i][indices[0]])+")</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
                    }
                }
            }else{
                    tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th>"+alumnosPos[i][indices[0]+12]+"</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
            }
        }
        
        this.pos.innerHTML = tabla_text;
        this.add.dom(960, grafica[1], this.pos,0,0).setOrigin(0,0);
        
    }
    
    
    
}

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 2080,
    backgroundColor: '#ffffff',
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: [menu],
    
    fps: {
        target: 30,
        forceSetTimeOut: true
    }
}

var game = new Phaser.Game(config);

function ActualizarGrupo(){
    //console.log("actualizando Grupo");
    var g=document.getElementById('grupo').value;
    
    var grupo_alumnos = "";
    if(g==="*"){
        for(var i=0; i<alumnos.length; i++){
            grupo_alumnos=grupo_alumnos + "<option value='"+alumnos[i][1]+"'>"+alumnos[i][0]+"</option>";
        }
    }else{
        for(var i=0; i<alumnos.length; i++){
            if(alumnos[i][2]===g){
                grupo_alumnos=grupo_alumnos + "<option value='"+alumnos[i][1]+"'>"+alumnos[i][0]+"</option>";
            }
        }
    }
    //console.log("actualizando Grupo");
    r=document.getElementById('alumnos');
    r.innerHTML="<option value='*' selected>Todos</option>"+grupo_alumnos;
    
    
    var tabla_text="<tr> <th>Examen</th> <th>Total(128)</th><th>Hab Mat(16)</th><th>Hab Verb(16)</th><th>Biología(12)</th><th>Español(12)</th><th>Física(12)</th><th>FCyE(12)</th><th>Geografía(12)</th><th>Matemáticas(12)</th><th>Química(12)</th><th>Hist U(6)</th><th>Hist M(6)</th></tr>";
        
    var alumnosPresentados=[0,0];
    promediosd1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], promediosd2=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], cambios=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if(g==="*"){
        document.getElementById('grupoT').innerHTML="Grupo: Todos";
        for(var j=0; j<12;j++){
            alumnosPresentados=[0,0];
            for(var i=0;i<alumnos.length;i++){
                if(alumnos[i][indices[0]]!==""){
                    alumnosPresentados[0] ++;
                    promediosd1[j]+=parseInt(alumnos[i][indices[j]]);
                }
                if(alumnos[i][indices[0]+12]!==""){
                    alumnosPresentados[1] ++;
                    promediosd2[j]+=parseInt(alumnos[i][indices[j]+12]);
                }
            }
                
            promediosd1[j]=(promediosd1[j]/alumnosPresentados[0]).toFixed(1);
            promediosd2[j]=(promediosd2[j]/alumnosPresentados[1]).toFixed(1);
            cambios[j]=(promediosd2[j]-promediosd1[j]).toFixed(1);
        }
    }else{
        document.getElementById('grupoT').innerHTML="Grupo: "+g;
        for(var j=0; j<12;j++){
            alumnosPresentados=[0,0];
            for(var i=0;i<alumnos.length;i++){
                if(alumnos[i][indices[0]]!=="" && alumnos[i][2]===g){
                    alumnosPresentados[0] ++;
                    promediosd1[j]+=parseInt(alumnos[i][indices[j]]);
                }
                if(alumnos[i][indices[0]+12]!=="" && alumnos[i][2]===g){
                    alumnosPresentados[1] ++;
                    promediosd2[j]+=parseInt(alumnos[i][indices[j]+12]);
                }
            }
            
            promediosd1[j]=(promediosd1[j]/alumnosPresentados[0]).toFixed(1);
            promediosd2[j]=(promediosd2[j]/alumnosPresentados[1]).toFixed(1);
            cambios[j]=(promediosd2[j]-promediosd1[j]).toFixed(1);
        }
    }
    tabla_text = tabla_text+ "<tr><th>D1</th>";
    for(var i=0;i<promediosd1.length;i++){
        tabla_text = tabla_text +  "<th>"+promediosd1[i]+"</th>";
    }
    tabla_text = tabla_text + "</tr>";
    tabla_text = tabla_text+ "<tr><th>D2</th>";
    for(var i=0;i<promediosd2.length;i++){
        if(cambios[i]>0){
            tabla_text = tabla_text +  "<th style='background-color:#00FF00'>";
        }else{
            if(cambios[i]<0){
                tabla_text = tabla_text +  "<th style='background-color:#FF0000'>";
            }else{
                tabla_text = tabla_text +  "<th>";
            }
        }
        tabla_text = tabla_text + promediosd2[i]+"("+cambios[i]+")</th>";
    }
    
    tabla_text = tabla_text + "</tr>";

    r=document.getElementById('tabla');
    r.innerHTML = tabla_text;
    
}

function Buscar(){
    var r=document.getElementById('alumnos').value;
    var pos=0;
    if(r!=="*"){
        for(var i=0; i<alumnos.length;i++){
            if(alumnos[i][1]===r){
                pos=i;
            }
        }
        document.getElementById('Nombre').innerHTML=alumnos[pos][0];
        document.getElementById('grupoT').innerHTML=alumnos[pos][2];
        var s="";
        s="<tr> <th>Examen</th> <th>Total(128)</th><th>Hab Mat(16)</th><th>Hab Verb(16)</th><th>Biología(12)</th><th>Español(12)</th><th>Física(12)</th><th>FCyE(12)</th><th>Geografía(12)</th><th>Matemáticas(12)</th><th>Química(12)</th><th>Hist U(6)</th><th>Hist M(6)</th></tr>";
        for(var k=0;k<2;k++){
            s=s+"<tr><th>D"+(k+1)+"</th>";
            for(var i=0;i<indices.length;i++){
                if(k===0){
                    s=s+"<th>";
                    s=s+alumnos[pos][indices[i]+k*12];
                    s=s+"</th>";
                }else{

                    if(parseInt(alumnos[pos][indices[i]+k*12])>parseInt(alumnos[pos][indices[i]+(k-1)*12])){
                        s=s+"<th style='background-color:#00FF00'>";
                    }else{
                        if(alumnos[pos][indices[i]+k*12]===alumnos[pos][indices[i]+(k-1)*12] || alumnos[pos][indices[i]+k*12]==="" || alumnos[pos][indices[i]+(k-1)*12]===""){
                            s=s+"<th>";
                        }else{
                            s=s+"<th style='background-color:#FF0000'>";
                        }

                    }
                    s=s+alumnos[pos][indices[i]+k*12]+"  ("+(parseInt(alumnos[pos][indices[i]+k*12])-parseInt(alumnos[pos][indices[i]]))+")";
                    s=s+"</th>";
                }


            }
            s=s+"</tr>";
        }
        document.getElementById('tabla').innerHTML=s;
    }else{
        ActualizarGrupo();
    }
    
}

function Grafica(){
    graphics.clear();
    r= document.getElementById('Materia').value;
    tituloG.innerHTML =materias[r];
    for(var i=0;i<12;i++){
        tamaños[i].innerHTML=(puntajes[r]-i*puntajes[r]/12).toFixed(1);
        line = new Phaser.Geom.Line(grafica[0], grafica[1]+espacio*i, grafica[0]+gancho, grafica[1]+espacio*i);
        graphics.strokeLineShape(line);
    }
    line = new Phaser.Geom.Line(grafica[0], grafica[1], grafica[0], grafica[1]+espacio*11);
    graphics.strokeLineShape(line);
    line = new Phaser.Geom.Line(grafica[0]+gancho, grafica[1], grafica[0]+gancho, grafica[1]+espacio*11);
    graphics.strokeLineShape(line);
    var circle =new Phaser.Geom.Circle(500, 500, 3);
        
    for(var i=0; i<this.grupos.length;i++){ //grupo
        for(var j=0; j<alumnos.length;j++){ //alumnos
            for(var k=0; k<examenes-1;k++){ //examenes
                if(alumnos[j][indices[r]+k*12]!=="" && alumnos[j][indices[r]+12+k*12]!==""){
                    if(parseInt(alumnos[j][indices[r]+k*12])<parseInt(alumnos[j][indices[r]+k*12+12])){
                        graphics.lineStyle(2,0x00ff00);
                    }else{
                        if(parseInt(alumnos[j][indices[r]+k*12])>parseInt(alumnos[j][indices[r]+k*12+12])){
                            graphics.lineStyle(2,0xff0000);
                        }else{
                            graphics.lineStyle(2,0x0000ff);
                        }
                    }
                    if(this.grupos[i]===alumnos[j][2]){
                        line = new Phaser.Geom.Line(grafica[0]+(1+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[r]+k*12])/puntajes[r]*11*espacio, grafica[0]+(2+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[r]+k*12+12])/puntajes[r]*11*espacio);
                        graphics.strokeLineShape(line);
                    }
                }
                if(alumnos[j][indices[0]+k*12]!==""){
                    if(this.grupos[i]===alumnos[j][2]){
                        circle =new Phaser.Geom.Circle(grafica[0]+(1+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[r]+k*12])/puntajes[r]*11*espacio, 5);
                        graphics.fillStyle(colores[k]);
                        graphics.fillCircleShape(circle);
                    }
                }
                if(alumnos[j][indices[0]+k*12+12]!==""){
                    if(this.grupos[i]===alumnos[j][2]){
                        circle =new Phaser.Geom.Circle(grafica[0]+(2+3*i)*gancho/(3*(examenes+1)), grafica[1]+11*espacio-parseInt(alumnos[j][indices[r]+k*12+12])/puntajes[r]*11*espacio, 5);
                        graphics.fillStyle(colores[k+1]);
                        graphics.fillCircleShape(circle);
                    }
                }
            }
        }
    }
    var tabla_text="<tr><th>Posición</th><th>Nombre</th><th>Grupo</th><th>"+materias[r]+"</th><th>% de Asistencia</th></tr>";
        
        
    alumnosPos = alumnos.sort((a,b)=>{
        if(b[indices[r]+12]===""){
            return -1;
        }else{
            if(a[indices[r]+12]===""){
                return 1;
            }
        }
        return parseInt(b[indices[r]+12])-parseInt(a[indices[r]+12]);

    });
    
    for(var i=0;i<alumnosPos.length;i++){
        if(alumnosPos[i][indices[0]+12]!=="" && alumnosPos[i][indices[0]]!==""){
            if(parseInt(alumnosPos[i][indices[0]+12])>parseInt(alumnosPos[i][indices[0]])){
                tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th style='background-color:#00ff00'>"+alumnosPos[i][indices[r]+12]+"("+(alumnosPos[i][indices[0]+12]-alumnosPos[i][indices[0]])+")</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
            }else{
                if(parseInt(alumnosPos[i][indices[0]+12])<parseInt(alumnosPos[i][indices[0]])){
                    tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th style='background-color:#ff0000'>"+alumnosPos[i][indices[r]+12]+"("+(alumnosPos[i][indices[0]+12]-alumnosPos[i][indices[0]])+")</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
                }else{
                    tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th>"+alumnosPos[i][indices[r]+12]+"("+(alumnosPos[i][indices[0]+12]-alumnosPos[i][indices[0]])+")</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
                }
            }
        }else{
                tabla_text=tabla_text+"<tr><th>"+(i+1)+"</th><th>"+alumnosPos[i][0]+"</th><th>"+alumnosPos[i][2]+"</th><th>"+alumnosPos[i][indices[r]+12]+"</th><th>"+(parseInt(alumnosPos[i][4])/parseInt(alumnosPos[i][3])*100).toFixed(2)+"</th></tr>";
        }
    }

    document.getElementById('posiciones').innerHTML = tabla_text;
}
function comparar(a,b,r){
    if(b[indices[r]+12]===""){
            return -1;
        }else{
            if(a[indices[r]+12]===""){
                return 1;
            }
        }
        return parseInt(b[indices[r]+12])-parseInt(a[indices[r]+12]);
}