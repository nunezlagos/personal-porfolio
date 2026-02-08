// headData.js
function loadHeadData() {
    fetch('../public/json/head.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los datos del head');
            }
            return response.json();
        })
        .then(headData => {
            document.title = headData.title;

            const metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            metaDescription.content = headData.description;
            document.head.appendChild(metaDescription);

            const metaKeywords = document.createElement("meta");
            metaKeywords.name = "keywords";
            metaKeywords.content = headData.keywords;
            document.head.appendChild(metaKeywords);

            const metaAuthor = document.createElement("meta");
            metaAuthor.name = "author";
            metaAuthor.content = headData.author;
            document.head.appendChild(metaAuthor);

            const metaViewport = document.createElement("meta");
            metaViewport.name = "viewport";
            metaViewport.content = "width=device-width, initial-scale=1, maximum-scale=1";
            document.head.appendChild(metaViewport);

            const linkFavicon = document.createElement("link");
            linkFavicon.rel = "icon";
            linkFavicon.href = headData.favicon;
            document.head.appendChild(linkFavicon);

            headData.stylesheets.forEach(href => {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = href;
                document.head.appendChild(link);
            });

            const twitterCardMeta = document.createElement("meta");
            twitterCardMeta.name = "twitter:card";
            twitterCardMeta.content = headData.twitterCard.card;
            document.head.appendChild(twitterCardMeta);

            const twitterSite = document.createElement("meta");
            twitterSite.name = "twitter:site";
            twitterSite.content = headData.twitterCard.site;
            document.head.appendChild(twitterSite);

            const twitterTitle = document.createElement("meta");
            twitterTitle.name = "twitter:title";
            twitterTitle.content = headData.twitterCard.title;
            document.head.appendChild(twitterTitle);

            const twitterDescription = document.createElement("meta");
            twitterDescription.name = "twitter:description";
            twitterDescription.content = headData.twitterCard.description;
            document.head.appendChild(twitterDescription);

            const twitterImage = document.createElement("meta");
            twitterImage.name = "twitter:image";
            twitterImage.content = headData.twitterCard.image;
            document.head.appendChild(twitterImage);

            const ogTitle = document.createElement("meta");
            ogTitle.property = "og:title";
            ogTitle.content = headData.openGraph.title;
            document.head.appendChild(ogTitle);

            const ogType = document.createElement("meta");
            ogType.property = "og:type";
            ogType.content = headData.openGraph.type;
            document.head.appendChild(ogType);

            const ogUrl = document.createElement("meta");
            ogUrl.property = "og:url";
            ogUrl.content = headData.openGraph.url;
            document.head.appendChild(ogUrl);

            const ogImage = document.createElement("meta");
            ogImage.property = "og:image";
            ogImage.content = headData.openGraph.image;
            document.head.appendChild(ogImage);

            const ogDescription = document.createElement("meta");
            ogDescription.property = "og:description";
            ogDescription.content = headData.openGraph.description;
            document.head.appendChild(ogDescription);
        })
        .catch(error => {
            console.error('Error cargando los datos del head:', error);
        });
}

window.onload = loadHeadData;
