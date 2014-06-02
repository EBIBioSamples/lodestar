package uk.ac.ebi.utils.servlet.logging;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;

/**
 * When used in a web application, automatically inserts certain information from the server context (e.g., client's
 * IP, client's URL) into {@link MDC}. This is essentially like <a href = "http://tinyurl.com/lo27hvs">ch.qos.logback.classic.helpers.MDCInsertingServletFilter</a>,
 * and in fact we use the same variables that are used in such class, however we only depends on SLF4J and not on that 
 * particular logger, so this is useful when you're not logging with Logback, but you want the same functionality. 
 * 
 * <dl>
 * <dt>date</dt>
 * <dd>22 Apr 2014</dd>
 * </dl>
 * 
 * @author Marco Brandizi
 * 
 */
public class Slf4JMDCInsertingFilter implements Filter
{
	/**
	 * These comes from ch.qos.logback.classic.ClassicConstants and we use the same names, so that code migrated from
	 * logback doesn't need changes.
	 */
	public static final String REQUEST_REMOTE_HOST_MDC_KEY = "req.remoteHost";
	public static final String REQUEST_USER_AGENT_MDC_KEY = "req.userAgent";
	public static final String REQUEST_REQUEST_URI = "req.requestURI";
	public static final String REQUEST_QUERY_STRING = "req.queryString";
	public static final String REQUEST_REQUEST_URL = "req.requestURL";
	public static final String REQUEST_X_FORWARDED_FOR = "req.xForwardedFor";

	public void init ( FilterConfig cfg ) throws ServletException
	{
	}

	public void destroy ()
	{
	}
	

	public void doFilter ( ServletRequest req, ServletResponse resp, FilterChain chain ) throws IOException, ServletException
	{
		MDC.put ( REQUEST_REMOTE_HOST_MDC_KEY, req.getRemoteHost() );

		HttpServletRequest httpReq = null;
		if ( req instanceof HttpServletRequest )
		{
			httpReq = (HttpServletRequest) req;

			MDC.put ( REQUEST_REQUEST_URI, httpReq.getRequestURI () );
			MDC.put ( REQUEST_REQUEST_URL, httpReq.getRequestURL ().toString () );
			MDC.put ( REQUEST_QUERY_STRING, StringUtils.trimToEmpty ( httpReq.getQueryString () ) );
			MDC.put ( REQUEST_USER_AGENT_MDC_KEY, StringUtils.trimToEmpty ( httpReq.getHeader ( "User-Agent" ) ) );
			MDC.put ( REQUEST_X_FORWARDED_FOR, StringUtils.trimToEmpty ( httpReq.getHeader ( "X-Forwarded-For" ) ) );
		}

		try {
			chain.doFilter ( req, resp );
		} 
		finally
		{
			MDC.remove ( REQUEST_REMOTE_HOST_MDC_KEY );
			if ( req != null )
			{
				MDC.remove ( REQUEST_REQUEST_URI );
				MDC.remove ( REQUEST_REQUEST_URL );
				MDC.remove ( REQUEST_QUERY_STRING );
				MDC.remove ( REQUEST_USER_AGENT_MDC_KEY );
				MDC.remove ( REQUEST_X_FORWARDED_FOR );
			}
		}
	}


}
