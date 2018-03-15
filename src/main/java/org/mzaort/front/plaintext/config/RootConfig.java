package org.mzaort.front.plaintext.config;

import java.util.regex.Pattern;

import org.mzaort.front.plaintext.WebConstants;
import org.mzaort.front.plaintext.config.RootConfig.WebPackage;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.core.type.filter.RegexPatternTypeFilter;

@Configuration
@Import(DataConfig.class)
@ComponentScan(basePackages = { WebConstants.BASE_PACKAGE }, excludeFilters = {
		@Filter(type = FilterType.CUSTOM, value = WebPackage.class) })
public class RootConfig {
	public static class WebPackage extends RegexPatternTypeFilter {
		public WebPackage() {
			super(Pattern.compile(WebConstants.WEB_PACKAGE, Pattern.LITERAL));
		}
	}
}
