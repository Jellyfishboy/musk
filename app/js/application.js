'use strict';

(function() 
{

    var menuSelector, calculateOffset, displaySearchbar, displayMobileMenu;

    $(document).ready(function()
    {
        menuSelector();
        displaySearchbar();
        displayMobileMenu();
    });

    menuSelector = function() 
    {
        var $elem, parentOffset, firstWidth, firstOffset, firstValue;

        $elem = $('nav ul li.active');
        parentOffset = $('nav').offset();
        firstValue = calculateOffset($elem, parentOffset.left);
        $('#spot').css('left', firstValue);

        $('nav ul li').hoverIntent(function() 
        {
            var elemWidth, elemOffset, moveValue, timeout;

            timeout = $('nav ul li').data('timeout');
            if (timeout) clearTimeout(timeout);
            $('#spot').stop().animate({ left: calculateOffset($(this), parentOffset.left)+'px' });
        }, function()
        {
            $('nav ul li').data("timeout", setTimeout($.proxy(function() 
            {
                $('#spot').stop().animate({ left: firstValue+'px' });            
            }, this), 300));
            
        });
    };

    calculateOffset = function(elem, parentOffsetLeft)
    {
        var elemWidth, elemOffset;

        elemWidth = (elem.width()/2)-6;
        elemOffset = elem.offset();
        return (elemOffset.left - parentOffsetLeft)+elemWidth+15;
    };

    displaySearchbar = function()
    {
        $('li[title="search"]').click(function() 
        {
            $('header').toggleClass('search-active');
            $('li[title="menu"').removeClass('active');
            $('header').removeClass('menu-active');
            $(this).toggleClass('active');
        });
    };

    displayMobileMenu = function ()
    {
        $('li[title="menu"]').click(function()
        {
            $('header').toggleClass('menu-active');
            $('li[title="search"]').removeClass('active');
            $('header').removeClass('search-active');
            $(this).toggleClass('active');
        });
    };

}).call(this);