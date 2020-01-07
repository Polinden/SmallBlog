root="http://192.168.77.200:5984/"
uploaddir='uploads/'

var vm = new Vue({
  el: '.post',
  data: {
    author: this.author,
    dish: this.dish,
    short: this.short,
    link: this.link,
    ingr: this.ingr,
    recipe: this.recipe,
    pic: this.pic,
    picr: this.picr,
    stared: 3,
    rid: this.rid,
    rev: this.rev,
    stars: [{'key':1, 'cl':'fa-star-o'}, {'key':2, 'cl':'fa-star-o'},{'key':3, 'cl':'fa-star-o'},{'key':4, 'cl':'fa-star-o'},{'key':5, 'cl':'fa-star-o'} ]
  },
    computed: {
  },
    created() {
    var arr = new URL(document.URL);
    id=decodeURI(arr.searchParams.get("id"));
    skip=0; limit=600;
    to_find={"_id":{"$eq": id}}
    request={"selector": to_find}
    request['skip']=skip
    request['limit']=limit
    header={"headers": {'Content-Type': 'application/json'}}
    auth={'username': 'papa', 'password' : 'secret'}
    axios({method: 'post', url: root+"cookbook/_find", data: request, config: header, auth: auth})
       .then((response) => {
          if (response.data['docs'].length>0){
              res=JSON.parse(JSON.stringify(response.data['docs'][0]))
              this.dish=res['dish']
              this.short=decodeURIComponent((res['short']).replace(/\+/g, '%20'))
              this.rev=res['_rev']
              this.rid=res['_id']
              this.link=res['work']['link']
              this.ingr=decodeURIComponent((res['work']['ingr']).replace(/\+/g, '%20'))
              this.recipe=decodeURIComponent((res['work']['recipe']).replace(/\+/g, '%20'))
              this.picr=res['work']['photo']
              this.pic=uploaddir+res['work']['photo']
              this.author=res['auth_name']+' | '+ (res['work']['date']).toString()
          }
       })
       .catch((error) => {
              console.log(error);
       });

       for (i=0; i<this.stared; i++)
         {this.stars[i].cl='fa-star'}
  },

  methods: {
    rate: function (event) {
         this.stared=event.toElement.id;
         for (i=0; i<5; i++)
           {this.stars[i].cl='fa-star-o'}
         for (i=0; i<this.stared; i++)
           {this.stars[i].cl='fa-star'}
     },

    remove: function() {
      var arr = new URL(document.URL);
      id=decodeURI(arr.searchParams.get("id"));
      if (!confirm('Are you sure?')) {return;}
      axios({method: 'delete', url: root+"cookbook/"+id+"?rev="+this.rev})
       .then((response) => {
          if (response.data.ok){
              alert("Removed!")
              window.location.href = "/index.html"
          }
       })
       .catch((error) => {
              console.log(error);
       });
     } 
  }
})




