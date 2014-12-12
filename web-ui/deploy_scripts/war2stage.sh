# Must be run as rdf_adm from ebi-001, after the copy of biosamples.war onto ebi-001 (see cp_ebi-001.sh)
# Deploys the war on the stage server ves-hx-f2
scp brandizi@ebi-001:/tmp/biosamples.war \
	ves-hx-f2:/nfs/public/rw/webadmin/tomcat/bases/rdf/tc-rdf-sparql_dev/deploy/biosamples.war
