root = "http://192.168.77.200:5984/"
uploaddir='uploads/'

Vue.component('blog-post', {
  props: ['mdata'],
  computed: {
     page1: function() {
         return '/page1.html?id='+this.mdata.id;
     }
  },
  template: `
       <div class="replaced2 col-sm-6 col-lg-5 col-xs-6">
           <div class="panel panel-default">
               <article class="panel-body">
                  <img v-bind:src="mdata.pic" onclick="window.open(this.src);" class="img1 img-thumbnail img-responsive">
                  <p class="text-muted"> By <span class="glyphicon glyphicon-user" aria-hidden="true">
                         </span> {{ mdata.author }} | <span class="glyphicon glyphicon-calendar" aria-hidden="true">
                         </span>{{ mdata.ddate }}<h3>{{ mdata.dish }}</h3>
                         <p class="ps1">{{ mdata.short }}<br>
                            <a v-bind:href="mdata.link">Source link...</a>
                         </p>
                         <a v-bind:href="page1" class="but1 btn btn-success">Read more...</a>
                  </p>
               </article>
           </div>
       </div>
  `
})



var vm = new Vue({
  el: '.starter',

  data: {
    fdata: [],
    skip: 0,
    limit: 4,
    found: 0
  },
  watch: {
    limit: function (val) {
      this.limit=parseInt(val)
      this.findq()
    }
  },
    computed: {
  },
    created() {
    this.findq()
  },

  methods: {
    findq: function () {
    var arr = new URL(document.URL) 
    e1=decodeURI(arr.searchParams.get("search")) 
    if (e1=='null') {e1=''}
    for (s=0, a1=e1.trim().toLowerCase(), e=""; s<a1.length; s++){e+='('+a1[s]+'|'+a1.toUpperCase()[s]+')'}
    re_str='(?i).*' + e + '.*'
    to_find={"dish":{"$regex": re_str}}
    request={"selector": to_find}
    request['skip']=this.skip
    request['limit']=this.limit
    header={"headers": {'Content-Type': 'application/json'}}
    auth={'username': 'papa', 'password' : 'secret'}
    axios({method: 'post', url: root+"cookbook/_find", data: request, config: header, auth: auth})
       .then((response) => {
          this.found=response.data.docs.length
          this.fdata=[]
          for (i=0; i<this.found; i++){
              res=JSON.parse(JSON.stringify(response.data['docs'][i]))
              ffdata={}
              ffdata.num=i
              ffdata.id=res['_id']
              ffdata.dish=res['dish']
              ffdata.short=decodeURIComponent((res['short']).replace(/\+/g, '%20'))
              ffdata.author=res['auth_name']             
              ffdata.link=res['work']['link']
              ffdata.ingr=decodeURIComponent((res['work']['ingr']).replace(/\+/g, '%20'))
              ffdata.recipe=decodeURIComponent((res['work']['recipe']).replace(/\+/g, '%20'))
              ffdata.pic=uploaddir+res['work']['photo']
              ffdata.ddate=(res['work']['date']).toString()
              this.fdata[i]=ffdata
          }
          this.fdata=this.fdata.chunk(2)
       })
       .catch((error) => {
              console.log(error);
       });
    },

    next: function(){
         if (this.found < this.limit) {return;} 
         console.log(this.skip+1);
         this.skip=this.skip+this.limit
         this.findq()
       },

    prev: function(){ 
         this.skip=this.skip-this.limit
         if (this.skip<0) {this.skip=0}
         console.log(this.skip);
         this.findq()
      }
  }
})




//helper

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
      R.push(this.slice(i, i + chunkSize));
    return R;
  }
});


