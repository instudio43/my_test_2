// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: 12,
        /* Optional */
        loadProductFirst: false,
    }
};

// Declare Templates
var bcSfFilterTemplate = {
    'soldOutClass': 'sold-out',
    'saleClass': 'on-sale',
    'soldOutLabelHtml': '<div>' + bcSfFilterConfig.label.sold_out + '</div>',
    'saleLabelHtml': '<div class="sale-item icn">' + bcSfFilterConfig.label.sale + '</div>',
    'vendorHtml': '<h3>{{itemVendorLabel}}</h3>',

    // Grid Template
	'productGridItemHtml' :  '<div class="product first-time-hover desktop-4 tablet-2 mobile-half name-auto-resize" id="prod-{{itemId}}" data-alpha="{{itemTitle}}" data-price="{{itemPriceDigits}}">'
  							+ '<p class="sale_title" style="display: block !important;">{{itemDiscountTag}}</p>' + '<div class="ci">'
								+ '<div class="smartwishlist-container">'
									+ '{{loveItHtml}}'
								+ '</div>'
								// + '{{itemNewLabel}}'
								// + '{{itemSaleLabel}}'
								+ '<div class="reveal">'
									+ '<a href="{{itemUrl}}" title="{{itemTitle}}" class="product-link">'
										+ '<div class="front">'
											+ '<img src="{{itemThumbUrlLow}}" alt="{{itemTitle}}"'
												+ 'data-sizes="auto"'
												+ 'data-src="{{itemThumbUrl}}"'
												+ 'data-srcset="{{itemThumbUrl}} 900w"'
												+ 'class="img-fluid lazyload"'
											+ '/>'
										+ '</div>'
									+ '</a>'
									+ '<div class="image-slider">'
										+ '<a href="{{itemUrl}}" >'
										+ '<img src="{{itemSecondThumbUrlLow}}" alt="{{itemTitle}}"'
											+ 'data-sizes="auto"'
											+ 'data-src="{{itemSecondThumbUrl}}"'
											+ 'data-srcset="{{itemSecondThumbUrl}} 900w"'
											+ 'class="img-fluid lazyload"'
										+ '/>'
										+ '</a>'
									+ '</div>'
										+ '{{varientsHtml}}'
								+ '</div>'
							+ '</div>'
							+ '<div class="product-info">'
								+ '<a class="fancybox.ajax product-modal" href="{{itemUrl}}">' + bcSfFilterConfig.label.quick_view + '</a>'
								+ '<a href="{{itemUrl}}">'
									+ '<span class="product_bg">'
										+ '<div class="product-details">'
											+ '<h2>{{itemTitle}}</h2>'
  											+ '<div class="product-type">{{itemType}}</div>'
											+ '{{itemVendor}}'
											+ '{{itemColor}}'
											+ '{{itemPrice}}'
										+ '</div>'
									+ '</span>'
								+ '</a>'
							+ '</div>'
						+ '</div>',

    /*'productGridItemHtml': '<div class="grid__item wide--one-fifth large--one-quarter medium-down--one-half">' +
                                '<div class="{{soldOutClass}} {{saleClass}}">' +
                                    '<a href="{{itemUrl}}" class="grid-link">' +
                                        '<span class="grid-link__image grid-link__image--product">' +
                                            '{{itemSaleLabel}}' +
                                            '{{itemSoldOutLabel}}' +
                                            '<span class="grid-link__image-centered"><img src="{{itemThumbUrl}}" alt="{{itemTitle}}" /></span>' +
                                        '</span>' +
                                        '<p class="grid-link__title">{{itemTitle}}</p>' +
                                        '{{itemVendor}}' +
                                        '{{itemPrice}}' +
                                    '</a>' +
                                '</div>' +
                            '</div>',*/


    // Pagination Template
    'previousActiveHtml': '<li><a href="{{itemUrl}}">&larr;</a></li>',
    'previousDisabledHtml': '<li class="disabled"><span>&larr;</span></li>',
    'nextActiveHtml': '<li><a href="{{itemUrl}}">&rarr;</a></li>',
    'nextDisabledHtml': '<li class="disabled"><span>&rarr;</span></li>',
    'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
    'paginateHtml': '<ul class="pagination-custom">{{previous}}{{pageItems}}{{next}}</ul>',

    // Sorting Template
    'sortingHtml': '<label class="label--hidden">' + bcSfFilterConfig.label.sorting + '</label><select class="collection-sort__input">{{sortingItems}}</select>',
};

/************************** BUILD PRODUCT LIST **************************/

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
    /*** Prepare data ***/
	// console.log("check here");
	// console.log(data);
    var images = data.images_info;
    data.price_min *= 100, data.price_max *= 100, data.compare_at_price_min *= 100, data.compare_at_price_max *= 100; // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add Thumbnail
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '900x') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

	var itemThumbUrlLow = images.length > 0 ? this.optimizeImage(images[0]['src'], '100x') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrlLow}}/g, itemThumbUrlLow);

	var itemSecondThumbUrl = images.length > 1 ? this.optimizeImage(images[1]['src'], '900x') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemSecondThumbUrl}}/g, itemSecondThumbUrl);

	var itemSecondThumbUrlLow = images.length > 1? this.optimizeImage(images[1]['src'], '100x') : itemThumbUrlLow;
    itemHtml = itemHtml.replace(/{{itemSecondThumbUrlLow}}/g, itemSecondThumbUrlLow);

    // Add Price
    var itemPriceHtml = '';
    if (data.title != '')  {
        itemPriceHtml += '<div class="grid-link__meta price">';
        if (onSale) {
            itemPriceHtml += '<div class="grid-link__sale_price onsale">' + this.formatMoney(data.price_min) + '</div> ';
            itemPriceHtml += '<div class="grid-link__sale_price was">' + this.formatMoney(data.compare_at_price_min) + '</div> ';
        /* }
        if (priceVaries) {
            itemPriceHtml += (bcSfFilterConfig.label.from_price).replace(/{{ price }}/g, '<div class="prod-price">' + this.formatMoney(data.price_min)) + '</div>'; */
        } else {
            itemPriceHtml += '<div class="prod-price">' + this.formatMoney(data.price_min) + '</div>';
        }
        itemPriceHtml += '</div>';
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add soldOut class
    var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
    itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);

    // Add onSale class
    var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
    itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);

    // Add soldOut Label
    var itemSoldOutLabelHtml = soldOut ? bcSfFilterTemplate.soldOutLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabelHtml);

    // Add onSale Label
    var itemSaleLabelHtml = onSale ? bcSfFilterTemplate.saleLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabelHtml);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{itemVendorLabel}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

	// console.log(firstVariant.option_color);
    // Add main attribute (Always put at the end of this function)
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  	itemHtml = itemHtml.replace(/{{itemType}}/g, data.product_type);
  
  if(data.tags.includes('10OFF')) {
  	itemHtml = itemHtml.replace(/{{itemDiscountTag}}/g, '10% OFF');
  }
  
  if(data.tags.includes('20OFF')) {
  	itemHtml = itemHtml.replace(/{{itemDiscountTag}}/g, '20% OFF');
  }
  
  if(data.tags.includes('35OFF')) {
  	itemHtml = itemHtml.replace(/{{itemDiscountTag}}/g, '35% OFF');
  }

	/* for love it functionality start */
	var loveItHtml;
	if(window.customLoggedIn){
		loveItHtml = '<span tabindex="0" class="smartwishlist" data-product="'+data.id+'" data-variant="'+firstVariant.id+'"></span>';

	}else{
		loveItHtml = '<a tabindex="0" href="javascript:void(0);" class="smartwishlist-label" onclick="$(\'#wishlist-pop, #wishlist-overlay\').fadeIn();$(\'body\').addClass(\'wl-pop-open\');"><span class="fa fa-heart-o"></span></a>';
	}
	itemHtml = itemHtml.replace(/{{loveItHtml}}/g, loveItHtml);
	/* for love it functionality end */

    // itemHtml = itemHtml.replace(/{{firstVariantId}}/g, firstVariant.id);
    itemHtml = itemHtml.replace(/{{itemColor}}/g, '<div class="product-color">'+firstVariant.option_color+'</div>');
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data).replace(/^\/collections\/[^\/]*/, ""));

	//custom replacements
	itemHtml = itemHtml.replace(/{{itemPriceDigits}}/g, data.price_min);
	var newLabel = '';
	jQuery.each( data.collections, function ( key, value ) {
		if ( value.handle == "whats-new" ) {
			newLabel = value.title;
		}
	});
	if ( newLabel !== '' ) {
		itemHtml = itemHtml.replace(/{{itemNewLabel}}/g, '<div class="new icn">' + newLabel + '</div>');
	}else{
		itemHtml = itemHtml.replace(/{{itemNewLabel}}/g, '');
	}

	if( data.images[2] ) {
		itemHtml = itemHtml.replace(/{{itemImgFlip}}/g, '<img src="' + data.images[2] + '" alt="' + data.title + '" />');
	}

	var productUrl = this.buildProductItemUrl(data);

 	var showVarants = false;
  	jQuery.each(data.options, function(k, v){
      	if(v == 'size'){
          	showVarants = true;
      	}
  	});

  	var varientsHtml = '';
	if ( data.variants && showVarants ) {
		varientsHtml += '<div class="varients"><ul>';
		jQuery.each(data.variants , function( key, val){
			var varClass = '';
			if( val.available == false ){ varClass = 'out-of-stock' }
			varientsHtml += '<li class='+ varClass +'><a href="javascript:void(0);" class="add-to-cart-dynamic" data-variant="' + val.id  + '">' + val.title.split(" / ")[0] + '</a></li>';
		});
		varientsHtml += '</ul></div>';
	}
 	itemHtml = itemHtml.replace(/{{varientsHtml}}/g, varientsHtml);

    return itemHtml;
};

// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function(data) {
    // // Add Description
    // var itemDescription = jQ('<p>' + data.body_html + '</p>').text();
    // // Truncate by word
    // itemDescription = (itemDescription.split(" ")).length > 51 ? itemDescription.split(" ").splice(0, 51).join(" ") + '...' : itemDescription.split(" ").splice(0, 51).join(" ");
    // // Truncate by character
    // itemDescription = itemDescription.length > 350 ? itemDescription.substring(0, 350) + '...' : itemDescription.substring(0, 350);
    // itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);
};

// Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData = function(data) {
    for (var k in data) {
        // Featured image
        if (data['images_info'] > 0) {
            data[k]['featured_image'] = data['images_info'][0];
        } else {
            data[k]['featured_image'] = {width: '', height: '', aspect_ratio: 0}
        }

        // Add Options
        var optionsArr = [];
        for (var i in data[k]['options_with_values']) {
            optionsArr.push(data[k]['options_with_values'][i]['name']);
        }
        data[k]['options'] = optionsArr;

        // Customize variants
        for (var i in data[k]['variants']) {
            var variantOptionArr = [];
            var count = 1;
            var variant = data[k]['variants'][i];
            // Add Options
            var variantOptions = variant['merged_options'];
            if (Array.isArray(variantOptions)) {
                for (var j = 0; j < variantOptions.length; j++) {
                    var temp = variantOptions[j].split(':');
                    data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];
                    data[k]['variants'][i]['option_' + temp[0]] = temp[1];
                    variantOptionArr.push(temp[1]);
                }
                data[k]['variants'][i]['options'] = variantOptionArr;
            }
            data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;
            data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100;
        }

        // Add Description
        data[k]['description'] = data[k]['body_html'];
    }
    return data;
};

/************************** END BUILD PRODUCT LIST **************************/

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    if (this.getSettingValue('general.paginationType') == 'default') {
        // Get page info
        var currentPage = parseInt(this.queryParams.page);
        var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

        // If it has only one page, clear Pagination
        if (totalPage == 1) {
            jQ(this.selector.bottomPagination).html('');
            return false;
        }

        if (this.getSettingValue('general.paginationType') == 'default') {
            var paginationHtml = bcSfFilterTemplate.paginateHtml;

            // Build Previous
            var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
            previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
            paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

            // Build Next
            var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml :  bcSfFilterTemplate.nextDisabledHtml;
            nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
            paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

            // Create page items array
            var beforeCurrentPageArr = [];
            for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
                beforeCurrentPageArr.unshift(iBefore);
            }
            if (currentPage - 4 > 0) {
                beforeCurrentPageArr.unshift('...');
            }
            if (currentPage - 4 >= 0) {
                beforeCurrentPageArr.unshift(1);
            }
            beforeCurrentPageArr.push(currentPage);

            var afterCurrentPageArr = [];
            for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
                afterCurrentPageArr.push(iAfter);
            }
            if (currentPage + 3 < totalPage) {
                afterCurrentPageArr.push('...');
            }
            if (currentPage + 3 <= totalPage) {
                afterCurrentPageArr.push(totalPage);
            }

            // Build page items
            var pageItemsHtml = '';
            var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
            for (var iPage = 0; iPage < pageArr.length; iPage++) {
                if (pageArr[iPage] == '...') {
                    pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
                } else {
                    pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
                }
                pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
                pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
            }
            paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

            jQ(this.selector.bottomPagination).html(paginationHtml);
        }
    }
};

/************************** BUILD TOOLBAR **************************/

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build Display type (List / Grid / Collage)
// BCSfFilter.prototype.buildFilterDisplayType = function() {
//     var itemHtml = '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="change-view bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><i class="fa fa-th" aria-hidden="true"></i><span class="fallback-text">Grid view</span></span></a>';
//     itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="change-view bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><i class="fa fa-list" aria-hidden="true"></i><span class="fallback-text">List view</span></span></a>';
//     jQ(this.selector.topDisplayType).html(itemHtml);

//     // Active current display type
//     jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').removeClass('active');
//     jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').removeClass('active');
//     if (this.queryParams.display == 'list') {
//         jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').addClass('active');
//     } else if (this.queryParams.display == 'grid') {
//         jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').addClass('active');
//     }
// };

/************************** END BUILD TOOLBAR **************************/

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  this.buildRobotsMetaTag();};

/* boost-start-2.4.2 */
/* If you upgrade the lib to the version >= 2.4.2, please comment the functions below out */
BCSfFilter.prototype.buildRobotsMetaTag = function(data) { var self = this; var metaContent = 'meta[content="noindex,nofollow"]'; if (self.checkIfPFParamsPartOfAURL() === true && jQ('head').find( metaContent).length === 0) { var m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m); } }; BCSfFilter.prototype.checkIfPFParamsPartOfAURL = function() { var self = this; if (window.location.search.length > 0 && window.location.search.indexOf('pf_') > 0) { return true; } return false; };
/* boost-end-2.4.2 */

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
