var separator="";
var openFile = function(event) {
var input = event.target;
var reader = new FileReader();
reader.onload = function()
    {
        var text = reader.result;
        header_tabel='<table contenteditable="true" id="tabel_csv">';
        footer_tabel='</table>';
        var rezultat_final='';
        var variabila=reader.result;
        
        const allLines = variabila.split(/\r\n|\n/);// bucata asta ne ajuta sa facem split de elemente. . . in cazul in care vom avea probleme la mai multe chestii eliminam const de acolo .. si facem var .. 
        // Reading line by line
        var numarator_linie=0;
        allLines.forEach((line) => {
                var linia_de_prelucrat=separator_elemente_linie(numarator_linie,line);
                rezultat_final=rezultat_final.concat(linia_de_prelucrat);//acum trebuie sa facem modificari pe fiecare linie ca sa putem sa facem parse la csv . .
                numarator_linie++;
            });
        rezultat_final=header_tabel.concat(rezultat_final,footer_tabel);

        document.getElementById("csv_area").innerHTML=rezultat_final;//aici e zona in care se scrie textul in consola.  .  . 
        document.getElementById("loading_image").style.display = "none";//hide preloader
    };

    reader.readAsText(input.files[0]);//NU STIU CE FACE ASTA <

  };


  function separator_elemente_linie(nr_linie,continut)
    {  
         separator=descoperire_separator(continut);//asta trebuie sa o modificam mai tarziu probabil va fi paramentru la functie..
        



       

        for(;;)
            {
                if(separator==continut.slice(-1))
                      continut=continut.slice(0, -1);  
                else break;     
            }
        
            var double_separator=separator.concat(separator);

        for(;;)
            {
                if(continut.includes(double_separator))
                      continut=continut.replace(double_separator,separator);  
                else break;     
            }

        
        var rezultatul_de_afisat='';
        array= (continut.split(separator));
        

        if(nr_linie==0)
            {   
                array.forEach(item => rezultatul_de_afisat=rezultatul_de_afisat.concat('<th>',item,'</th>'));
                rezultatul_de_afisat=('<tr>'.concat(rezultatul_de_afisat,'</tr>'));
            }
            
        else
            {
                array.forEach(item => rezultatul_de_afisat=rezultatul_de_afisat.concat('<td>',item,'</td>'));
                rezultatul_de_afisat=('<tr>'.concat(rezultatul_de_afisat,'</tr>'));
            }
            

        return rezultatul_de_afisat;
    }

function display_preloader()
  {
    document.getElementById("loading_image").style.display = "inline";
  }

function descoperire_separator(text)
  { 
    if(document.getElementById('custom').checked)
      return(document.getElementById("field_custom").value);

      var separatoare=[';',',','|'];
      var number_of_encounters=[0,0,0];

      for (i = 0; i < separatoare.length; i++) 
        { 
          number_of_encounters[i]=text.split(separatoare[i]).length - 1;
        }

        var biggest_frequency=0;

        for (i = 0; i < separatoare.length-1; i++) 
          {
            if(number_of_encounters[i]<number_of_encounters[i+1])
              biggest_frequency=i+1;
          }

    return separatoare[biggest_frequency];
  }

function reload()
  {
    location.reload();
  }

function display_save_form()
  {
    document.getElementById("save_form").style.display = "inline";
  }

function save()
    { 
      var filename=document.getElementById("save_name").value;
      
      if(!filename)
       {
        alert('Insert a name for the file!');
        return;
       }
 
        var htmlContent_string = document.getElementById("csv_area").innerHTML;//textul de salvat. . .. ..         

      if(htmlContent=="")
       {
         alert('There is no file to save');
         return;
       }

var filetype='.csv';
    if(document.getElementById('format_html').checked) 
       filetype='.html';

      if(filetype=='.csv')
        {
          //prelucrare csv 

          htmlContent_string=htmlContent_string.replace('<table contenteditable="true" id="tabel_csv">',"");  
          htmlContent_string=htmlContent_string.replace("</table>","");  
          htmlContent_string=htmlContent_string.replace("<tbody>","");
          htmlContent_string=htmlContent_string.replace("</tbody>","");
          //only one apparition max.. 

          for(;;)
            {
              if(htmlContent_string.includes("<td>"))
                {
                  htmlContent_string=htmlContent_string.replace("<tr>","");
                  htmlContent_string=htmlContent_string.replace("</tr>","\n");
                  htmlContent_string=htmlContent_string.replace("<th>",""); 
                  htmlContent_string=htmlContent_string.replace("<td>","");   
                  htmlContent_string=htmlContent_string.replace("</th>",separator);   
                  htmlContent_string=htmlContent_string.replace("</td>",separator);
                }
                else 
                  break;
              
            }
        }
      else
        htmlContent_string='<style>#tabel_csv { font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%; } #tabel_csv tr:hover {background-color: #ddd;}  #tabel_csv td, #tabel_csv th { border: 1px solid #ddd; padding: 8px; }  #tabel_csv tr:nth-child(even){background-color: #f2f2f2;} #tabel_csv th { padding-top: 12px; padding-bottom: 12px;  text-align: left; background-color: #4CAF50; color: white; } table, th, td { border: 1px solid black;   } </style>'.concat(htmlContent_string);
        //html format conversion

      var htmlContent = [htmlContent_string];//textul de salvat. . .. ..         

  var bl = new Blob(htmlContent, {type: "text/html"});
  var a = document.createElement("a");//no idea wtf is this .. 
  a.href = URL.createObjectURL(bl);
  a.download = filename.concat(filetype);
  a.hidden = true;
  document.body.appendChild(a);
  a.innerHTML = "Anvelomag.ro";
  a.click();

  alert("File saved !");

}
