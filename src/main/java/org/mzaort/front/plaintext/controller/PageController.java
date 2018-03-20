package org.mzaort.front.plaintext.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pages")
public class PageController {

	@RequestMapping(value = "/{pageName}", method = GET)
	public String openPage(@PathVariable String pageName) {
		return pageName;
	}
}
