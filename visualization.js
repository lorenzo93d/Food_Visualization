var nodeList1 = [];
var ingredients2recipes = {};
var openRecipes=[];
var archi = null;
var recipesJSON = null;
var ingredients;
var recipes;
var allCategories=null;
var aree = null;
var mappaSigle = {
    "American": 'us',
	"British": 'gb',
	"Chinese": 'cn',
	"French": 'fr',
	"Greek": 'gr',
	"Indian" : 'in',
	"Italian" : 'it',
	"Japanese" : 'jp',
	"Mexican" : 'mx',
	"Spanish" : 'es',
	"Thai" : 'th'
}


var getAreas = (function (){ 
    $.ajax({
      'async':false,
      'global':false,
      'url':'areas.json',
      'success': function (data) {
        nodi = []
        aree = []
        nodi.push({id:'Center',
                     shape:'circle', label:'Double click \n to restart '})
        for (var x in data) { 
            nodi.push({id:data[x], 
                        shape: 'image' ,
                        image: 'fotoBandiere/'+data[x]+'.png',
                        label : data[x]
                        
             }) //uso data[x] perche è di tipo 'id -> nome'
            aree.push(data[x])  
          }
      }
    });
    return this.nodi
  });
  this.nodi_area=getAreas()


  var getRecipes = (function (){
    $.ajax({
      'async':false,
      'global':false,
      'url':'meals.json',
      'success': function (data) {
        recipesJSON=data    
        nodi = []
        allCategories=[]
        var fotoricetta;
        for (var x in data){
            if(allCategories.indexOf(data[x]['category'])==-1){
                allCategories.push(data[x]['category'])
            }
            fotoricetta = 'fotoricette/'+x+'.jpg'
            if (fotoricetta==null)
              fotoricetta = 'fotoricette/Default.jpg'
            nodi.push({id:x, shape: 'circularImage',image: fotoricetta, label:x})
        }                
      }
    });
    return this.nodi
  });
  this.nodi_recipes=getRecipes()


var getEdges = ( function () {
  $.ajax({
    'async':false,
    'success': function(){
      archi = []
      for (x in aree){
        var dict = {
          from:'Center',
          to: aree[x],
          color:{color:'blue',highlight:'black',hover : 'blue'}
        }
        archi.push(dict)
      }
    }  
})
return this.archi
}
)
this.archi_aree_centro=getEdges()


var getUpdates = (function (selectedNode){
    if (aree.indexOf(selectedNode)!= -1){
        return getUpdates_byArea(selectedNode)
    }
    else if (selectedNode.indexOf('_')!= -1){
        return getUpdates_byCategory(selectedNode)
    }
   else if (Object.keys(recipesJSON).indexOf(selectedNode)!= -1){
        return getUpdates_byRecipe(selectedNode)
    } 
    else 
        return 1
})

var getUpdates_byArea = (function(selectedArea) {

    var recipesByArea=[]
    var tmpNodi = []
    var tmpArchi = []
    var categories = []
    
    // x = nome ricetta
    for (var x in this.recipesJSON){
        recipe = this.recipesJSON[x]
        var area = recipe['area']
        
        if (area==selectedArea){
            recipesByArea.push(x)
            if (categories.indexOf(recipe['category'])==-1){
                categories.push(recipe['category']) 
            }
        }
    }
        // aree con <10 ricette
        if (recipesByArea.length <10){
            for (var x in recipesByArea){
                var nomeRicetta = recipesByArea[x]
                var fotoricetta;      
                fotoricetta = 'fotoricette/'+nomeRicetta+'.jpg'
                if (fotoricetta==null)
                    fotoricetta = 'fotoricette/Default.jpg'
                // push nodo nuovo  
                var newNodo = ({id:nomeRicetta, shape: 'circularImage', image: fotoricetta,  label:nomeRicetta})
                tmpNodi.push(newNodo)
                // push arco nuovo
                var newArco = {
                    id: nomeRicetta,
                    from: selectedArea,
                    to: nomeRicetta,
                    color:{color:'green',highlight:'black',hover : 'green'}
                    }
                tmpArchi.push(newArco) 
                var updates = [tmpNodi, tmpArchi,[]]
            }
        }
        else {  // aree con > 9 ricette 

            for (var cat in categories){
                var fotoCategoria;      
                fotoCategoria = 'categories/'+categories[cat]+'.jpg'
                if (fotoCategoria==null)
                    fotoCategoria = 'fotoricette/Default.jpg'
                var newNodo = ({id:selectedArea+'_'+categories[cat], shape: 'image', image:fotoCategoria, label:categories[cat]})
                tmpNodi.push(newNodo)
                // push arco nuovo
                var newArco = {
                    id: selectedArea+'_'+categories[cat],
                    from: selectedArea,
                    to: selectedArea+'_'+categories[cat],
                    color:{color:'red', highlight:'black',hover : 'red'}
                    }
                tmpArchi.push(newArco) 
                var updates = [tmpNodi, tmpArchi, categories]
            }
        }             
        return updates
    })
      

var getUpdates_byCategory = (function(selectedCategory) {

    var category_area_name = selectedCategory.substring(0, selectedCategory.indexOf('_'))
    var categoryName = selectedCategory.substring(selectedCategory.indexOf('_')+1, selectedCategory.length)
    var recipesByCategory=[]

    var tmpNodi = []
    var tmpArchi = []

    for (var recipeName in this.recipesJSON){
        
        var recipe = this.recipesJSON[recipeName]
        var category = recipe['category']
        var area = recipe['area']

        if (category_area_name == area && categoryName == category )
            recipesByCategory.push(recipeName)
    }   
    for (var r in recipesByCategory){
        var nomeRicetta = recipesByCategory[r]
        var fotoricetta;       
        fotoricetta = 'fotoricette/'+nomeRicetta+'.jpg'
        if (fotoricetta==null)
            fotoricetta = 'fotoricette/Default.jpg'
            // push nodo nuovo  ||| per ogni ricetta pusho l'immagine  \\  
        var newNodo = ({id:nomeRicetta, shape: 'circularImage', image: fotoricetta,  label:nomeRicetta})
        tmpNodi.push(newNodo)
        // push arco nuovo
        var newArco = {
            id: nomeRicetta,
            from:selectedCategory,
            to: nomeRicetta,
            color:{color:'green',highlight:'black',hover : 'green'}
            }
        tmpArchi.push(newArco)
    }
    var updates = [tmpNodi,tmpArchi]
    return updates   
}) 


// lavora subito, al posto di updates torna 0
var getUpdates_byRecipe = (function(selectedRecipe){

    var ingredients = this.recipesJSON[selectedRecipe]['ingredients']

    // la ricetta non è aperta
    if (openRecipes.indexOf(selectedRecipe)==-1){
        for (var i in ingredients){
            var newIngredient = ingredients[i]
            
            // ingrediente nuovo, aggiorno mappa e creo nodi e archi
            if (Object.keys(ingredients2recipes).indexOf(newIngredient)== -1){
                ingredients2recipes[newIngredient]=[selectedRecipe]
                
                var newNodo = ({id:newIngredient,
                             shape: 'circularImage', 
                             image:'ingredienti/'+newIngredient+'.png',  
                             label:newIngredient})
               
                var newArco = {
                    id: selectedRecipe+'_'+newIngredient,
                    from:selectedRecipe,
                    to: newIngredient,
                    color:{color:'purple', highlight:'black',hover : 'purple'}
                    }
                nodes.add(newNodo)
                edges.add(newArco)
            }
            else{
                var tmp=ingredients2recipes[newIngredient]
                // se la ricetta non è associata all ingrediente
                tmp.push(selectedRecipe)
                ingredients2recipes[newIngredient]=tmp
                var newArco = {
                    id: selectedRecipe+'_'+newIngredient,
                    from:selectedRecipe,
                    to: newIngredient,
                    color:{color:'purple', highlight:'black',hover : 'purple'}
                    }
                edges.add(newArco)
            }
        }
        openRecipes.push(selectedRecipe)          
    }   
    // la ricetta è già aperta -> devo rimuoverla!
    else {
        for (var i in ingredients){
            var newIngredient = ingredients[i]
            var recipes = ingredients2recipes[newIngredient]
            // unica ricetta con quell'ingrediente
            if (recipes.length == 1){
                nodes.remove(newIngredient)
                var toRemove = selectedRecipe+'_'+newIngredient
                edges.remove(toRemove)
                delete ingredients2recipes[newIngredient]
            }
            else {
                var toRemove = selectedRecipe+'_'+newIngredient
                edges.remove(toRemove)
                var tmp = ingredients2recipes[newIngredient]
                tmp.splice(tmp.indexOf(selectedRecipe),1)
                ingredients2recipes[newIngredient]=tmp
            }   
        }
        openRecipes.splice(openRecipes.indexOf(selectedRecipe),1)
    }
return 0
})


// funzione che applica gli aggiornamenti al grafo
function drawUpdate(selectedNode){
    var updates = getUpdates(selectedNode)

    // serve a gestire il click a vuoto sugli ingredienti
    if (updates == 1) return 0
     // se NON è una ricetta
    if (updates != 0){
        // nodo non visitato --> da inserire
        if (nodeList1.indexOf(selectedNode)== -1){
            nodes.add(updates[0])
            edges.add(updates[1])
            nodeList1.push(selectedNode)
            }
        // nodo già visitato --> da rimuovere 
        else {  
            // se è una categoria
            if (updates.length==2){
                // se è aperta chiudo prima tutte le sue ricette               
                    if (nodeList1.indexOf(selectedNode)!=-1){  
                    var allRecipesNodes = getUpdates_byCategory(selectedNode)[0]
                    for (var i in allRecipesNodes){
                        var nodeID = allRecipesNodes[i]['id']
                        if (openRecipes.indexOf(nodeID) != -1)
                            getUpdates_byRecipe(nodeID) // rimuove automaticamente
                    }
                    nodeList1.splice(nodeList1.indexOf(selectedNode),1)
                }
                nodesTOremove = updates[0]
                edgesTOremove = updates[1]

                for (var x in nodesTOremove){
                    nodes.remove(nodesTOremove[x]['id'])
                }
                        for (var j in edgesTOremove){
                            edges.remove(edgesTOremove[j]['id'])
                            }
            }
            // se è un'area
            else if (updates.length==3) {
                // se ha le categorie (>10 ricette)
                if (updates[2].length!=0){
                // per ogni categoria 
                    for (var category in updates[2]){
                        var toClose = selectedNode+'_'+updates[2][category]
                        // se è aperta 
                        if (nodeList1.indexOf(toClose) != -1){
                            var newUpdates = getUpdates_byCategory(toClose)
                            var nodi = newUpdates[0]
                            // chiudo le ricette (se aperte)
                            for (var x in nodi){
                                var ricetta = nodi[x]['id'];                               
                                if (openRecipes.indexOf(ricetta)!= -1){
                                        // elimina ingredienti
                                        getUpdates_byRecipe(ricetta)  
                                    }
                                // rimuovo il nodo ricetta e l'arco associato
                                nodes.remove(ricetta)
                                edges.remove(ricetta)

                            } 
                            nodeList1.splice(nodeList1.indexOf(toClose),1)
                        }
                    // rimuovo nodo categoria a prescindere
                    nodes.remove(toClose)
                    edges.remove(toClose) 
                    }
                }
                // area con <10 ricette
                else{
                    // chiudo direttamente le ricette
                    var nodii = updates[0]
                    for (var x in nodii){
                        var ricetta = nodii[x]['id'];
                        
                        if (openRecipes.indexOf(ricetta)!= -1){
                                // elimina nodi e archi da solo (ma degli ingredienti!)
                                getUpdates_byRecipe(ricetta)     
                            }
                    } 

                }
                // rimuovo nodi e archi associati all' area
                nodesTOremove = updates[0]
                edgesTOremove = updates[1]
                for (var x in nodesTOremove){
                    nodes.remove(nodesTOremove[x]['id'])
                }
                for (var y in edgesTOremove){
                    edges.remove(edgesTOremove[y]['id'])
                }               
                nodeList1.splice(nodeList1.indexOf(selectedNode),1)
            }            
            }
    }
};

function draw(){
nodes = new vis.DataSet(this.nodi_area)
edges = new vis.DataSet(this.archi_aree_centro)

var nodoHelp = {id:'Help',
                shape:'circle',
                 label:'Double click \n to interact! '}

nodes.add(nodoHelp)

// lista {area -> dati}
var container = document.getElementById('mynetwork');

var data = {
    nodes: nodes,
    edges: edges
};
var options =
{
physics:{
    enabled: true,
    barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: 100,
        springConstant: 0.04, 
        damping: 0.04,
        avoidOverlap: 1
    },
    forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 100,
        damping: 1,
        avoidOverlap: 0
        },
    maxVelocity: 65,
    minVelocity: 0.85,
    solver: 'forceAtlas2Based', // hierarchicalRepulsion - barnesHut - forceAtlas2Based
    stabilization: {
        enabled: false,
        iterations: 2000,
        updateInterval: 100,
        onlyDynamicEdges: true,
        fit: false
    },
    timestep: 0.5,
    adaptiveTimestep: true
    },

interaction:{hover:true},
    manipulation: {
        enabled: false
    },
nodes:{
    size : 25,
    borderWidth: 3,
    borderWidthSelected: 4,
    brokenImage:undefined,
    chosen: {
        label : true
        },   
    color: {
        border: '#2B7CE9',
        background: '#97C2FC',
        highlight: {    
        border: '#2B7CE9',
        background: '#2B7CE9'
        },
        hover: {
        border: 'red',
        background: '#97C2FC'
        },
        }
        ,     
    shapeProperties: {
        useBorderWithImage:false,
        useImageSize:false
        }
        }
};

var network = new vis.Network(container, data, options);

network.on("doubleClick", function (params) {
    var clickedNode = this.getNodeAt(params.pointer.DOM)
    if (clickedNode != undefined){
        if(clickedNode == 'Center'){
            network.destroy()
            draw()
        }
        else{
            nodes.remove('Help')
            drawUpdate(clickedNode)   
        }      
    }        
})
}
