(function(){
    let btnAddFolder=document.querySelector("#btnAddFolder");
    let divBreadCrumb=document.querySelector("#divBreadCrumb");
    let aRootPath=document.querySelector(".path");
    let container=document.querySelector("#container");
    let pageTemplates=document.querySelector("#pageTemplates");
    let fid=-1;
    let cfid=-1; //it is for the folder in which we are.
    let folders=[];
    btnAddFolder.addEventListener("click",addFolder);
    aRootPath.addEventListener("click",navigateBreadCrumb);
    function addFolder(){
        let fname=prompt("Enter the folder name :");
        if(!fname){
            return;
        }
        let exists=folders.some(f=>f.name==fname);
        if(exists ==false){
        ++fid;
        addFolderInPage(fname,fid,cfid);
        folders.push({
            id:fid,
            name:fname ,
            pid:cfid 
          })
          persistFolders();
        } else{
            alert(fname + " already exists");
        } 
        }
    
    function editFolder(){
        let divFolder=this.parentNode;
        let divName=divFolder.querySelector("[purpose='name']");
        

        let fname=prompt("Enter the new name for :"+divName.innerHTML);
        if(!fname){
            return;
        }
        if(fname!=divName.innerHTML){
        let exists=folders.filter(f => f.pid==cfid).some(f=> f.name==fname );
        if(exists ==false){
            //html
            divName.innerHTML=fname;
            //ram
             let folder=folders.filter(f => f.pid==cfid).find(f => f.id==parseInt(divFolder.getAttribute("fid")));
             folder.name=fname;
        //storage in data.
            persistFolders();
        }else{
            alert(fname + " already exists.")
        }
    }else{
        alert(" This is the old name that you are giving . Please enter something new. ");
    }
    }
    function deleteFolder(){
        let divFolder=this.parentNode;
        let divName=divFolder.querySelector("[purpose='name']");
        let fidtbd=parseInt(divFolder.getAttribute("fid"));
        let flag= confirm("Are you sure you want to delete the folder"+" " +divName.innerHTML);
        if(flag==true){
        let exists=folders.some(f=>f.pid==fidtbd);
        if(exists==false){
            //html
         container.removeChild(divFolder);

            //RAM on array
         let idx=folders.findIndex(f => f.id==fidtbd);
         folders.splice(idx,1);
         
            //storage
         persistFolders();
        }else{
            alert("Can't Delete.Has children.");
        }
        }
     }
     function navigateBreadCrumb(){
        let fname=this.innerHTML;
        cfid=parseInt(this.getAttribute("fid"));

        container.innerHTML="";
        folders.filter(f => f.pid==cfid).forEach(f =>{
            addFolderInPage(f.name,f.id,f.pid);
        })
        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
     }
     function viewFolder(){
        let divFolder=this.parentNode;
        let divName=divFolder.querySelector("[purpose='name']");
        cfid=parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate=pageTemplates.content.querySelector(".path");
        let aPath= document.importNode(aPathTemplate,true);

        aPath.innerHTML=divName.innerHTML;
        aPath.setAttribute("fid",cfid);
        aPath.addEventListener("click",navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);

        container.innerHTML="";
        folders.filter(f => f.pid==cfid).forEach(f =>{
            addFolderInPage(f.name,f.id,f.pid);
        })
     }
    function addFolderInPage(fname,fid,pid){
        let divFolderTemplate=pageTemplates.content.querySelector(".folder");
        let divFolder=document.importNode(divFolderTemplate,true);
        
        
        let divName=divFolder.querySelector("[purpose='name']");
        divName.innerHTML=fname;
        divFolder.setAttribute("fid",fid);
        divFolder.setAttribute("pid",pid);

        let spanDelete=divFolder.querySelector("span[action='delete']");
        spanDelete.addEventListener("click",deleteFolder);
    
        let spanEdit=divFolder.querySelector("span[action='edit']");
        spanEdit.addEventListener("click",editFolder )

        let spanView=divFolder.querySelector("span[action='view']");
        spanView.addEventListener("click",viewFolder )
        container.appendChild(divFolder);
       
    }
    function persistFolders(){
        console.log(folders);
        let fjson=JSON.stringify(folders);
        localStorage.setItem("data",fjson)
    }
    function loadFolderFromStorage(){
        let fjson=localStorage.getItem("data");
        if(!!fjson){
        folders=JSON.parse(fjson);
        folders.forEach(function(f){
            if(f.id>fid){
                fid=f.id;
            }
          if(f.pid===cfid){
            addFolderInPage(f.name,f.id,f.pid);
           }
           
           
        })
    }
    }
    loadFolderFromStorage();
})();