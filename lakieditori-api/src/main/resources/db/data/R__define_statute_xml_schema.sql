-- define schema if it doesn't exist
INSERT INTO schema (name)
SELECT 'statute'
WHERE NOT EXISTS(SELECT 1
                 FROM schema
                 WHERE name = 'statute');

-- define first schema definition if it doesn't exist
INSERT INTO schema_definition (schema_name, index, name, definition)
SELECT 'statute', 1, '1', ''
WHERE NOT EXISTS(SELECT 1
                 FROM schema_definition
                 WHERE schema_name = 'statute'
                   AND index = 1);

-- define second schema definition if it doesn't exist
INSERT INTO schema_definition (schema_name, index, name, definition)
SELECT 'statute', 2, '2', ''
WHERE NOT EXISTS(SELECT 1
                 FROM schema_definition
                 WHERE schema_name = 'statute'
                   AND index = 2);

UPDATE schema_definition
SET name       = 'xml.xsd',
    definition = '<?xml version="1.0"?>
<?xml-stylesheet href="../2008/09/xsd.xsl" type="text/xsl"?>
<xs:schema targetNamespace="http://www.w3.org/XML/1998/namespace"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns   ="http://www.w3.org/1999/xhtml"
  xml:lang="en">

 <xs:annotation>
  <xs:documentation>
   <div>
    <h1>About the XML namespace</h1>

    <div class="bodytext">
     <p>
      This schema document describes the XML namespace, in a form
      suitable for import by other schema documents.
     </p>
     <p>
      See <a href="http://www.w3.org/XML/1998/namespace.html">
      http://www.w3.org/XML/1998/namespace.html</a> and
      <a href="http://www.w3.org/TR/REC-xml">
      http://www.w3.org/TR/REC-xml</a> for information
      about this namespace.
     </p>
     <p>
      Note that local names in this namespace are intended to be
      defined only by the World Wide Web Consortium or its subgroups.
      The names currently defined in this namespace are listed below.
      They should not be used with conflicting semantics by any Working
      Group, specification, or document instance.
     </p>
     <p>
      See further below in this document for more information about <a
      href="#usage">how to refer to this schema document from your own
      XSD schema documents</a> and about <a href="#nsversioning">the
      namespace-versioning policy governing this schema document</a>.
     </p>
    </div>
   </div>
  </xs:documentation>
 </xs:annotation>

 <xs:attribute name="lang">
  <xs:annotation>
   <xs:documentation>
    <div>

      <h3>lang (as an attribute name)</h3>
      <p>
       denotes an attribute whose value
       is a language code for the natural language of the content of
       any element; its value is inherited.  This name is reserved
       by virtue of its definition in the XML specification.</p>

    </div>
    <div>
     <h4>Notes</h4>
     <p>
      Attempting to install the relevant ISO 2- and 3-letter
      codes as the enumerated possible values is probably never
      going to be a realistic possibility.
     </p>
     <p>
      See BCP 47 at <a href="http://www.rfc-editor.org/rfc/bcp/bcp47.txt">
       http://www.rfc-editor.org/rfc/bcp/bcp47.txt</a>
      and the IANA language subtag registry at
      <a href="http://www.iana.org/assignments/language-subtag-registry">
       http://www.iana.org/assignments/language-subtag-registry</a>
      for further information.
     </p>
     <p>
      The union allows for the ''un-declaration'' of xml:lang with
      the empty string.
     </p>
    </div>
   </xs:documentation>
  </xs:annotation>
  <xs:simpleType>
   <xs:union memberTypes="xs:language">
    <xs:simpleType>
     <xs:restriction base="xs:string">
      <xs:enumeration value=""/>
     </xs:restriction>
    </xs:simpleType>
   </xs:union>
  </xs:simpleType>
 </xs:attribute>

 <xs:attribute name="space">
  <xs:annotation>
   <xs:documentation>
    <div>

      <h3>space (as an attribute name)</h3>
      <p>
       denotes an attribute whose
       value is a keyword indicating what whitespace processing
       discipline is intended for the content of the element; its
       value is inherited.  This name is reserved by virtue of its
       definition in the XML specification.</p>

    </div>
   </xs:documentation>
  </xs:annotation>
  <xs:simpleType>
   <xs:restriction base="xs:NCName">
    <xs:enumeration value="default"/>
    <xs:enumeration value="preserve"/>
   </xs:restriction>
  </xs:simpleType>
 </xs:attribute>

 <xs:attribute name="base" type="xs:anyURI"> <xs:annotation>
   <xs:documentation>
    <div>

      <h3>base (as an attribute name)</h3>
      <p>
       denotes an attribute whose value
       provides a URI to be used as the base for interpreting any
       relative URIs in the scope of the element on which it
       appears; its value is inherited.  This name is reserved
       by virtue of its definition in the XML Base specification.</p>

     <p>
      See <a
      href="http://www.w3.org/TR/xmlbase/">http://www.w3.org/TR/xmlbase/</a>
      for information about this attribute.
     </p>
    </div>
   </xs:documentation>
  </xs:annotation>
 </xs:attribute>

 <xs:attribute name="id" type="xs:ID">
  <xs:annotation>
   <xs:documentation>
    <div>

      <h3>id (as an attribute name)</h3>
      <p>
       denotes an attribute whose value
       should be interpreted as if declared to be of type ID.
       This name is reserved by virtue of its definition in the
       xml:id specification.</p>

     <p>
      See <a
      href="http://www.w3.org/TR/xml-id/">http://www.w3.org/TR/xml-id/</a>
      for information about this attribute.
     </p>
    </div>
   </xs:documentation>
  </xs:annotation>
 </xs:attribute>

 <xs:attributeGroup name="specialAttrs">
  <xs:attribute ref="xml:base"/>
  <xs:attribute ref="xml:lang"/>
  <xs:attribute ref="xml:space"/>
  <xs:attribute ref="xml:id"/>
 </xs:attributeGroup>

 <xs:annotation>
  <xs:documentation>
   <div>

    <h3>Father (in any context at all)</h3>

    <div class="bodytext">
     <p>
      denotes Jon Bosak, the chair of
      the original XML Working Group.  This name is reserved by
      the following decision of the W3C XML Plenary and
      XML Coordination groups:
     </p>
     <blockquote>
       <p>
	In appreciation for his vision, leadership and
	dedication the W3C XML Plenary on this 10th day of
	February, 2000, reserves for Jon Bosak in perpetuity
	the XML name "xml:Father".
       </p>
     </blockquote>
    </div>
   </div>
  </xs:documentation>
 </xs:annotation>

 <xs:annotation>
  <xs:documentation>
   <div xml:id="usage" id="usage">
    <h2><a name="usage">About this schema document</a></h2>

    <div class="bodytext">
     <p>
      This schema defines attributes and an attribute group suitable
      for use by schemas wishing to allow <code>xml:base</code>,
      <code>xml:lang</code>, <code>xml:space</code> or
      <code>xml:id</code> attributes on elements they define.
     </p>
     <p>
      To enable this, such a schema must import this schema for
      the XML namespace, e.g. as follows:
     </p>
     <pre>
          &lt;schema . . .>
           . . .
           &lt;import namespace="http://www.w3.org/XML/1998/namespace"
                      schemaLocation="http://www.w3.org/2001/xml.xsd"/>
     </pre>
     <p>
      or
     </p>
     <pre>
           &lt;import namespace="http://www.w3.org/XML/1998/namespace"
                      schemaLocation="http://www.w3.org/2009/01/xml.xsd"/>
     </pre>
     <p>
      Subsequently, qualified reference to any of the attributes or the
      group defined below will have the desired effect, e.g.
     </p>
     <pre>
          &lt;type . . .>
           . . .
           &lt;attributeGroup ref="xml:specialAttrs"/>
     </pre>
     <p>
      will define a type which will schema-validate an instance element
      with any of those attributes.
     </p>
    </div>
   </div>
  </xs:documentation>
 </xs:annotation>

 <xs:annotation>
  <xs:documentation>
   <div id="nsversioning" xml:id="nsversioning">
    <h2><a name="nsversioning">Versioning policy for this schema document</a></h2>
    <div class="bodytext">
     <p>
      In keeping with the XML Schema WG''s standard versioning
      policy, this schema document will persist at
      <a href="http://www.w3.org/2009/01/xml.xsd">
       http://www.w3.org/2009/01/xml.xsd</a>.
     </p>
     <p>
      At the date of issue it can also be found at
      <a href="http://www.w3.org/2001/xml.xsd">
       http://www.w3.org/2001/xml.xsd</a>.
     </p>
     <p>
      The schema document at that URI may however change in the future,
      in order to remain compatible with the latest version of XML
      Schema itself, or with the XML namespace itself.  In other words,
      if the XML Schema or XML namespaces change, the version of this
      document at <a href="http://www.w3.org/2001/xml.xsd">
       http://www.w3.org/2001/xml.xsd
      </a>
      will change accordingly; the version at
      <a href="http://www.w3.org/2009/01/xml.xsd">
       http://www.w3.org/2009/01/xml.xsd
      </a>
      will not change.
     </p>
     <p>
      Previous dated (and unchanging) versions of this schema
      document are at:
     </p>
     <ul>
      <li><a href="http://www.w3.org/2009/01/xml.xsd">
	http://www.w3.org/2009/01/xml.xsd</a></li>
      <li><a href="http://www.w3.org/2007/08/xml.xsd">
	http://www.w3.org/2007/08/xml.xsd</a></li>
      <li><a href="http://www.w3.org/2004/10/xml.xsd">
	http://www.w3.org/2004/10/xml.xsd</a></li>
      <li><a href="http://www.w3.org/2001/03/xml.xsd">
	http://www.w3.org/2001/03/xml.xsd</a></li>
     </ul>
    </div>
   </div>
  </xs:documentation>
 </xs:annotation>

</xs:schema>'
WHERE schema_name = 'statute'
  AND index = 1;

UPDATE schema_definition
SET name       = 'statute.xsd',
    definition = '<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:import namespace="http://www.w3.org/XML/1998/namespace" schemaLocation="xml.xsd"/>

  <xs:complexType name="localizedRichTextType">
    <xs:annotation>
      <xs:documentation>
        Localizable formatted text that can contain links.
      </xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="richTextType">
        <xs:attribute ref="xml:lang" default=""/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>

  <xs:complexType name="richTextType" mixed="true">
    <xs:annotation>
      <xs:documentation>
        Formatted text that can contain links.
      </xs:documentation>
    </xs:annotation>
    <xs:choice minOccurs="0" maxOccurs="unbounded">
      <xs:element name="a">
        <xs:complexType>
          <xs:complexContent>
            <xs:extension base="formattedTextType">
              <xs:attribute name="href" type="xs:anyURI" use="required"/>
            </xs:extension>
          </xs:complexContent>
        </xs:complexType>
      </xs:element>
      <xs:element name="em" type="richTextType"/>
      <xs:element name="strong" type="richTextType"/>
    </xs:choice>
  </xs:complexType>

  <xs:complexType name="formattedTextType" mixed="true">
    <xs:annotation>
      <xs:documentation>
        Text content that can contain formatting tags (e.g. ''em'').
      </xs:documentation>
    </xs:annotation>
    <xs:choice minOccurs="0" maxOccurs="unbounded">
      <xs:element name="em" type="formattedTextType"/>
      <xs:element name="strong" type="formattedTextType"/>
    </xs:choice>
  </xs:complexType>

  <xs:element name="statute">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="title" type="localizedRichTextType" maxOccurs="unbounded"/>
        <xs:element name="intro" type="localizedRichTextType" minOccurs="0" maxOccurs="unbounded"/>
        <xs:choice>
          <xs:element name="part" type="partType" minOccurs="0" maxOccurs="unbounded">
            <xs:unique name="uniquePartHeadingLang">
              <xs:selector xpath="heading"/>
              <xs:field xpath="@xml:lang"/>
            </xs:unique>
          </xs:element>
          <xs:element name="chapter" type="chapterType" minOccurs="0" maxOccurs="unbounded">
            <xs:unique name="uniqueChapterHeadingLang">
              <xs:selector xpath="heading"/>
              <xs:field xpath="@xml:lang"/>
            </xs:unique>
            <xs:unique name="uniqueChapterSubheadingLang">
              <xs:selector xpath="subheading"/>
              <xs:field xpath="@xml:lang"/>
              <xs:field xpath="@number"/>
            </xs:unique>
          </xs:element>
          <xs:choice maxOccurs="unbounded">
            <xs:element name="subheading" type="subheadingType" minOccurs="0"/>
            <xs:element name="section" type="sectionType" minOccurs="0">
              <xs:unique name="uniqueDocumentSectionHeadingLang">
                <xs:selector xpath="heading"/>
                <xs:field xpath="@xml:lang"/>
              </xs:unique>
            </xs:element>
          </xs:choice>
        </xs:choice>
      </xs:sequence>
      <xs:attribute name="id" type="xs:string"/>
      <xs:attribute name="number" type="xs:string" use="required"/>
      <xs:attribute name="createdBy" type="xs:string"/>
      <xs:attribute name="createdDate" type="xs:dateTime"/>
      <xs:attribute name="lastModifiedBy" type="xs:string"/>
      <xs:attribute name="lastModifiedDate" type="xs:dateTime"/>
      <xs:attribute name="state" type="documentState" default="UNSTABLE"/>
    </xs:complexType>
    <xs:unique name="uniqueDocumentTitleLang">
      <xs:selector xpath="title"/>
      <xs:field xpath="@xml:lang"/>
    </xs:unique>
    <xs:unique name="uniqueDocumentSubheadingLang">
      <xs:selector xpath="subheading"/>
      <xs:field xpath="@xml:lang"/>
      <xs:field xpath="@number"/>
    </xs:unique>
    <xs:unique name="uniqueDocumentNoteLang">
      <xs:selector xpath="note"/>
      <xs:field xpath="@xml:lang"/>
    </xs:unique>
    <xs:unique name="uniqueDocumentIntroLang">
      <xs:selector xpath="intro"/>
      <xs:field xpath="@xml:lang"/>
    </xs:unique>
  </xs:element>

  <xs:complexType name="subheadingType">
    <xs:complexContent>
      <xs:extension base="localizedRichTextType">
        <xs:attribute name="number" type="xs:string" use="required"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>

  <xs:simpleType name="documentState">
    <xs:restriction base="xs:string">
      <xs:enumeration value="UNSTABLE"/>
      <xs:enumeration value="DRAFT"/>
      <xs:enumeration value="RECOMMENDATION"/>
      <xs:enumeration value="DEPRECATED"/>
    </xs:restriction>
  </xs:simpleType>

  <xs:complexType name="partType">
    <xs:annotation>
      <xs:documentation>
        Part (in Finnish "osa").
      </xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="heading" type="localizedRichTextType" maxOccurs="unbounded"/>
      <xs:element name="chapter" type="chapterType" minOccurs="0" maxOccurs="unbounded">
        <xs:unique name="uniquePartChapterHeadingLang">
          <xs:selector xpath="heading"/>
          <xs:field xpath="@xml:lang"/>
        </xs:unique>
        <xs:unique name="uniquePartChapterSubheadingLang">
          <xs:selector xpath="subheading"/>
          <xs:field xpath="@xml:lang"/>
          <xs:field xpath="@number"/>
        </xs:unique>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="number" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="chapterType">
    <xs:annotation>
      <xs:documentation>
        Chapter (in Finnish "luku").
      </xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="heading" type="localizedRichTextType" maxOccurs="unbounded"/>
      <xs:choice maxOccurs="unbounded">
        <xs:element name="subheading" type="subheadingType" minOccurs="0"/>
        <xs:element name="section" type="sectionType" minOccurs="0">
          <xs:unique name="uniqueSectionHeadingLang">
            <xs:selector xpath="heading"/>
            <xs:field xpath="@xml:lang"/>
          </xs:unique>
        </xs:element>
      </xs:choice>
    </xs:sequence>
    <xs:attribute name="number" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="sectionType">
    <xs:annotation>
      <xs:documentation>
        Section (in Finnish "pykälä").
      </xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="heading" type="localizedRichTextType" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="subsection" type="subsectionType" minOccurs="0" maxOccurs="unbounded">
        <xs:unique name="uniqueSubsectionContentLang">
          <xs:selector xpath="content"/>
          <xs:field xpath="@xml:lang"/>
        </xs:unique>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="number" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="subsectionType">
    <xs:annotation>
      <xs:documentation>
        Subsection (in Finnish "momentti").
      </xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="content" type="localizedRichTextType" maxOccurs="unbounded"/>
      <xs:element name="paragraph" type="paragraphType" minOccurs="0" maxOccurs="unbounded">
        <xs:unique name="uniqueParagraphContentLang">
          <xs:selector xpath="content"/>
          <xs:field xpath="@xml:lang"/>
        </xs:unique>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="number" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="paragraphType">
    <xs:annotation>
      <xs:documentation>
        Paragraph (in Finnish "kohta").
      </xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="content" type="localizedRichTextType" maxOccurs="unbounded"/>
      <xs:element name="subparagraph" type="subparagraphType" minOccurs="0" maxOccurs="unbounded">
        <xs:unique name="uniqueSubparagraphContentLang">
          <xs:selector xpath="content"/>
          <xs:field xpath="@xml:lang"/>
        </xs:unique>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="number" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="subparagraphType">
    <xs:annotation>
      <xs:documentation>
        Subparagraph (in Finnish "alakohta").
      </xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="content" type="localizedRichTextType" maxOccurs="unbounded"/>
    </xs:sequence>
    <xs:attribute name="number" type="xs:string" use="required"/>
  </xs:complexType>

</xs:schema>'
WHERE schema_name = 'statute'
  AND index = 2;