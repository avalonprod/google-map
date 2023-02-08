function initMap() {
    const dataMap = {
      // These are general parameters for all			
      general: {
        mapId: "1177521b91f3d8ea",
        zoom: 4,
        // selector where to put the map			
        insertSelector: "#container-map",
        // link to logo			
        logoUrl: "http://floridakeyspass.com/wp-content/uploads/2022/07/Untitled-1-e1661473941550.png",
        // specifies whether controls will be displayed on the map if true then will be if false will not be			
        disableDefaultUI: true,
        // specifies to show all markers or only the current page if true, all markers will be displayed if false, only the marker of the current page will be displayed			
        allMarkers: false,
        // default values when the page is not defined			
        // Location to center the map and to display the marker			
        defaultBangalore: {
            lat: 25.095599,
            lng: -80.437106
        },
        // marker options			
        iconMarker: {
            // Default link to marker image			
            urlImgMarker: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            // marker size			
            size: [20, 28],
            // bouncing animation if true will work if false will not work			
            animation: false,
            // Allow marker dragging if true will work if false will not work			
            draggable: false,
            // numbering markers if true will work if false will not work			
            numbering: false
        },
    },
    // This is a set of pages with options for each page		
  
      pages: [
        {
          id: "63e2b861f5796c256c9c6701",
          href: "",
          urlImgMarker: "https://floridakeyspass.com/wp-content/uploads/2022/07/Scuba-Diver.png",
          bangalore: {
            lat: 25.080886,
            lng: -80.454156
          },
          dataPopup: {
            title: "Florida Keys",
            text: "Welcome to the Florida Keys",
            urlImg: "https://floridakeyspass.com/wp-content/uploads/2023/01/Key-West-Ocean-Water-Park.jpg",
            links: [
              {
                url: "https://floridakeyspass.com/product-category/things-to-do-in-the-florida-keys/",
                name: "View All Activities",
                linkId: "6201.324948337098"
              }
            ]
          }
        },
        {
          id: "63e2c167950549ba5452a91b",
          href: "https://floridakeyspass.com/product/key-west-vandenberg-wreck-dive/",
          urlImgMarker: "https://floridakeyspass.com/wp-content/uploads/2022/07/Scuba-Diver.png",
          bangalore: {
            lat: 24.559926,
            lng: -81.804737
          },
          dataPopup: {
            title: "Vandenberg Wreck",
            text: "The USS Vandenburg Wreck sits in about 140 ft. This is the 2nd largest wreck dive in the world",
            urlImg: "https://floridakeyspass.com/wp-content/uploads/2023/01/vandenberg-wreck-dive-key-west.jpg",
            links: [
              {
                url: "https://floridakeyspass.com/product/key-west-vandenberg-wreck-dive/",
                name: "Dive This Wreck",
                linkId: "-7632.037425666307"
              },
              {
                url: "https://floridakeyspass.com/product/key-west-vandenberg-wreck-dive/",
                name: "Get Advanced Certified Here",
                linkId: "-5619.716585452857"
              }
            ]
          }
        }
      ],
    
    };
  
    async function getPagesRequest() {
        await fetch("https://google-map-prod.onrender.com/api/get-pages-data")
          .then((res) => res.json())
          .then((data) => setData(data));
      }
      getPagesRequest();
      function setData(data) {
        dataMap.pages = data;
        console.log(data)
        init();
      }
  
    function init() {
      const hrefPage = window.location.href;
      function pagesInit() {
        for (let i = 0; i < dataMap.pages.length; i++) {
          if (dataMap.pages[i].href == hrefPage) {
            return dataMap.pages[i];
          } else {
            return dataMap.pages[0];
          }
        }
      }
  
      const dataPages = pagesInit();
    
  
      let dataMarker = [];
  
      function returnDataMarker() {
        if (dataMap.general.allMarkers) {
          for (let i = 0; i < dataMap.pages.length; i++) {
            dataMarker.push([
              dataMap.pages[i].bangalore,
              dataMap.pages[i].id,
              dataMap.pages[i].dataPopup,
              dataMap.pages[i].urlImgMarker,
            ]);
          }
        } else {
          dataMarker.push([
            dataPages.bangalore,
            dataPages.id,
            dataPages.dataPopup,
          ]);
        }
      }
  
      
  
      returnDataMarker();
  
      document.querySelector(dataMap.general.insertSelector).insertAdjacentHTML(
        "afterend",
        `				
  
        <div class="root-map">	
      
        <style>			
        #map {			
        width: 100%;			
        height: 260px;			
        position: relative !important;			
        }			
        .map-container {			
        position: relative;			
        margin-top: 300px;			
        }			
        .map-container .logo {			
        display: block;			
        width: 140px;			
        color: #000;			
        position: absolute;			
        z-index: 10000;			
        bottom: 20px;			
        left: 10px;			
        font-size: 20px;			
        }			
        .map-container .logo img {			
        width: 100%			
        }			
        .gmnoprint:not(.gm-bundled-control) {			
        display: none;			
        }			
        .gm-bundled-control .gmnoprint {			
        display: block;			
        }			
        .gm-style-iw.gm-style-iw-c {			
        padding: 0 !important;			
        height: auto !important;					
        max-height: 800px !important;			
        position: absolute !important;			
        left: 120px !important;			
        min-width: 280px !important;			
        }			
        .gm-style-iw-d {			
        overflow: hidden !important;			
        padding: 0 !important;			
        height: auto !important;			
        max-height: 800px !important;			
        }			
        .gm-ui-hover-effect {			
        background-color: rgba(255, 255, 255, 90%) !important;			
        border-radius: 50px !important;			
        margin-top: 14px !important;			
        margin-right: 14px !important;			
        display: flex !important;			
        justify-content: center !important;			
        align-items: center !important;			
        }			
        .gm-control-active.gm-fullscreen-control {
            display: none;
        }
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        }
        .wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .popup {
            margin-top: 30px;
            border: 1px solid #198fd9;
            border-radius: 8px;
            /* width: 800px; */
            /* height: 220px; */
            height: auto;
            min-height: 100px
          
        }

        .popup-wrapper {
           max-width: 1000px;
            height: auto;
            padding: 5px;
            display: flex;
          
            /* grid-template-columns: 1fr 4fr; */
        }

        .popup-img {
            display: block;
            min-height: 100% !important;
            width: 250px !important;
            border-radius: 7px;
            margin-right: 20px;
            
        }

        .popup-img img {
            display: block;
            height: 100% !important;
            width: 100% !important;
            border-radius: 7px;
        }
        .popup-title {
            color: #198fd9;
            font-size: 25px !important;
        }
        .popup-text {
            width: auto;
            font-size: 15px !important;
            font-weight: 600 !important;
            margin-right: 40px !important;
            
        }

        .subtitle {
            font-size: 18px !important;
            margin-top: 10px;
            color: #198fd9;
            font-weight: 600 !important;
        }


        .popup-links .list-item {
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr;
            color: #000;
            margin-left: 20px
        }

        .popup-links a {
            color: #000;
            transition: 0.5s ease;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
        }
        .popup-links a:hover {
            color: #198fd9;
        }
        @media (max-width: 720px) {
            .popup-img {
                display: none;
            }
        }
            
        @media (max-width: 1210px) {
            margin-top: 8px;
        }
            </style>			
            <div class="map-container">			
            <div class="logo"><img src="${dataMap.general.logoUrl}" alt="logo"></div>			
            <div id="map">			
            </div>			
            </div>			
            </div>				
          `
      );
  
    
      const bangalore = dataPages.bangalore;
  
  
      const map = new google.maps.Map(document.getElementById("map"), {
        mapId: "1177521b91f3d8ea",
        zoom: 12,
        center:
          bangalore == undefined ? dataMap.general.defaultBangalore : bangalore,
        disableDefaultUI: dataMap.general.disableDefaultUI ? false : true,
      });
      addMarker(map);

      function addMarker(map) {
        dataMarker.forEach(([position, id, dataPopup, urlImgMarker], i) => {
          let dataLinks = "";
  
          dataPopup.links.forEach((item) => {
            dataLinks += `				
          <li class="link-item"><a href="${item.url}">${item.name}</a></li>
          `;
          });
  
          const iconMarker = {
            url:
              urlImgMarker != ""
                ? urlImgMarker
                : dataMap.general.iconMarker.urlImgMarker,
            size: new google.maps.Size(
              dataMap.general.iconMarker.size[0],
              dataMap.general.iconMarker.size[1]
            ),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32),
          };
  
          const marker = new google.maps.Marker({
            position: position,
            label: dataMap.general.iconMarker.numbering ? id.toString() : null,
            map: map,
            icon: iconMarker,
            zIndex: 10,
            animation: dataMap.general.iconMarker.animation
              ? google.maps.Animation.BOUNCE
              : null,
            draggable: dataMap.general.iconMarker.draggable,
          });
  
          const contentString = `				
          
                          
	

      <div class="popup">
      <div class="popup-wrapper">
         
              <div class="popup-img">
                  <img src="${dataPopup.urlImg}" alt="img">
              </div>
       
          <div class="popup-content">
              <h3 class="popup-title">${dataPopup.title}</h3>
              <div class="popup-text">${dataPopup.text}.</div>
              <div class="subtitle">available at this location</div>
              <div class="popup-links">
                  <ul class="list-item">
                    ${dataLinks}
                  </ul>
              </div>
          </div>

          
      </div>

  </div>
          `;
          const modalContainer = document.querySelector("#container-popup");
          function changeDataPopup() {
            modalContainer.innerHTML = contentString;
            return true;
          }
  
          marker.addListener("click", () => {
            const ok = changeDataPopup();
            if (ok) {
              const popup = document.querySelector(".popup");
              popup.style.bottom = 0 + "px";
            }
          });
        });
      }
    }
  }
  
  window.initMap = initMap;
  
